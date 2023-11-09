import time
import json
import requests
timeNow = 1690329681
localData = json.load(open('data.json', 'r'))

for i in localData["schedulesArray"]:
    if timeNow > i:
        requests.get(f"https://back-jdb0.onrender.com/removeSchedule/{i}")


print("--")
# print(int(time.time()))