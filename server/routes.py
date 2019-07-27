from flask import Flask
from flask import request
from flask_restful import Api, Resource, reqparse
import apiUtility
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
api = Api(app)

class User(Resource):
    def get(self):
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
        # if (request.args is {} or request.args['lat'] is None or request.args['long'] is None):
        #     return 'invalid input!'
        

    def post(self):
        return request.args
    
api.add_resource(User, "/")
app.run(debug=True)
