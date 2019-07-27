from flask import Flask
from flask_restful import Api, Resource, reqparse
from . import routes

app = Flask(__name__)
api = Api(app)

if __name__ == '__main__':
    api.add_resource(User, "/")
    app.run(debug=True)