from flask import Flask
from flask import request
from flask import session
from flask_restful import Api, Resource, reqparse
import apiUtility
import datetime
import json
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
api = Api(app)

class User(Resource):
    # isflagged tells whether a bus is flagged at a stop or not.
    # if there is a key with the bus-id, then it is flagged at specified stops...
    # bus (key) -> [{ stop (key) -> number of people flagging (value) }] (value)
    # def __init__(self):
    #     super()
    #     isFlagged = {}

    def get(self):
        if ('auth' in request.args):
            # driver view!
            try:
                busId = (int(request.args['busNumber']), int(request.args['tripCode'])) 
                busId = str(busId)

                isFlagged = {}
                if os.path.exists('tempfile') and os.path.getsize('tempfile') > 0:
                    # load data from file
                    isFlagged = self.load('tempfile')

                if (busId in isFlagged):
                    # return all the stops.
                    return isFlagged[busId], 200
                else:
                    return 'no stops', 400
            except:
                return 'error while parsing request', 400
        else:
            if request.args != {}:
                try:
                    if (request.args['lat'] and request.args['long']):
                        # get the closest bus stop...
                        stop = apiUtility.get_stop_by_location(request.args['lat'], request.args['long'])

                        # get the list of buses...
                        buses = apiUtility.get_depart_from_stop(stop["id"])

                        # returns all the buses from the closest stop. utc time tho...
                        return { 'stop': stop, 'buses': buses }, 200
                except:
                    return "no bus stop found", 400
            else:
                return "no arguments!", 400        

    def post(self):
        #path = './tempfile'
        #flaginfo = request.args['']
        try:
            # flag a certain stop
            busId = (int(request.args['busNumber']), int(request.args['tripCode'])) 
            busId = str(busId)
            #return busId
            stopId = int(request.args['stopId'])
            stopId = str(stopId)
            flag = str(bool(request.args['flag'])).lower() == 'true'

            isFlagged = {}
            if os.path.exists('tempfile') and os.path.getsize('tempfile') > 0:
                # load data from file
                isFlagged = self.load('tempfile')

            keys = isFlagged.keys()
            #return isFlagged
            #return busId in keys
            # if the bus is flagged, at some stop...
            if (busId in keys): 
                # return 'worked kind of'
                # if the bus is flagged at a certain
                
                # for each stop the bus is flagged at...
                for stop in isFlagged[busId]:
                    innerkeys = stop.keys()
                    #return innerkeys
                    if (stopId in innerkeys):
                        if (flag):
                            stop[stopId] += 1
                        else:
                            if (stop[stopId] == 0):
                                return 'unexpected unflag when flag = 0', 400
                            else:
                                stop[stopId] -= 1
                    else:
                        if (flag):
                            stop[stopId] = 1
                        else:
                            return 'unexpected unflag when flag does not exist', 400
            else:
                if (flag):
                    isFlagged[busId] = [{ stopId: 1 }]
                else:
                    return 'unexpected unflag when bus was never flagged', 400

            self.save(isFlagged, 'tempfile')
            return 'got flagged!\n' + str(isFlagged), 200
        except Exception as e:
            return 'error when flagging!' + str(e), 400

    # saves the flagged dict.
    def save(self, flagged, file):
        try:
            f = open(file, 'w')
            f.write(json.dumps(flagged))
            f.close()
        except Exception as e:
            print ("error while opening file: " + str(e))

    # loads the saved dict into the current one.
    def load(self, file):
        try:
            f = open(file, 'r')
            flagged = json.loads(f.read())
            f.close()

            return flagged
        except:
            print ("error while opening file for loading")
    
api.add_resource(User, "/")
app.run(debug=True)
