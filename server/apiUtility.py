import requests
import os

api_key = ""
with open(os.path.abspath(os.path.join(os.path.dirname(__file__), 'apiKey')), "r") as keyFile:
    api_key = keyFile.readline().strip()

if api_key == "":
    raise Exception("File not found")

headers={
    "Authorization": "apikey " + api_key
}

def get_depart_from_stop(stop_id):
    r = requests.get('https://api.transport.nsw.gov.au/v1/tp/departure_mon',
        headers=headers,
        params={
        "outputFormat": "rapidJSON",
        "coordOutputFormat": "EPSG:4326",
        "mode": "direct",
        "type_dm": "stop",
        "name_dm": stop_id.split("-",1)[0],
        "departureMonitorMacro": "true",
        "excludedMeans": "checkbox",
        "exclMOT_1": "1", # Train
        "exclMOT_4": "1", # Light Rail
        "exclMOT_7": "1", # Coach
        "exclMOT_9": "1", # Ferry
        "TfNSWDM": "true",
        "version": "10.2.1.42"
    })
    
    return r.json()["stopEvents"]

'''
string coord:
    format: LONGITUDE:LATITUDE
'''
def get_stop_by_location(coord):
    coord += ":EPSG:4326"
    r = requests.get('https://api.transport.nsw.gov.au/v1/tp/coord',
        headers=headers,
        params={
        "outputFormat": "rapidJSON",
        "coord": coord,
        "coordOutputFormat": "EPSG:4326",
        "inclFilter": 1,    
        "type_1": "BUS_POINT",  
        "radius_1": 500, # Meters
        "PoisOnMapMacro": "true",
        "version": "10.2.1.42"
    })
    
    locations = r.json()["locations"]
    closest_stop = locations[0]
    closest_dist = int(closest_stop["properties"]["distance"])
    for location in locations:
        if int(location["properties"]["distance"]) < closest_dist:
            closest_stop = location
            closest_dist = int(location["properties"]["distance"])
    return closest_stop

if __name__ == "__main__":
    # Test data 
    stop = get_stop_by_location("151.230787:-33.918316")
    departures = get_depart_from_stop(stop["id"])
