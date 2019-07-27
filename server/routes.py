from flask import Flask
from flask import request
from flask_restful import Api, Resource, reqparse
import apiUtility
import datetime

app = Flask(__name__)
api = Api(app)

class User(Resource):
    def get(self):
        # get the closest bus stop...
        stop = apiUtility.get_stop_by_location(request.args['lat'], request.args['long'])

        # get the list of buses...
        buses = apiUtility.get_depart_from_stop(stop["id"])

        # returns all the buses from the closest stop. utc time tho...
        return buses

    def post(self):
        return request.args
    
api.add_resource(User, "/")
app.run(debug=True)