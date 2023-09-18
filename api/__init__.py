import logging
import threading
import time

import msgpack
import requests

from api.Moment import Moment

moments = []
finished = []
errored = []


def make_request(page: int):
    url = "https://www.queeringthemap.com/moments.msgpack"

    querystring = {"page": page}

    payload = ""
    response = requests.request("GET", url, data=payload, params=querystring)
    return response


def request_page(page: int):
    try:
        response = make_request(page)

        if response.status_code != 200:
            raise Exception("Non 200 http status code returned.")

        data = msgpack.unpackb(response.content, strict_map_key=False)

        for moment in data["moment_list"]:
            moments.append(Moment(
                moment["latitude"],
                moment["longitude"],
                moment["description"],
                moment["id"]
            ))

        finished.append(page)
    except Exception as e:
        print(f"request {page} failed: {e}")
        errored.append(page)


def get_moments() -> list[Moment]:
    response = make_request(1)
    data = msgpack.unpackb(response.content, strict_map_key=False)
    pages = data["pages"]

    for page in range(1, pages + 1):
        threading.Thread(target=request_page, args={page}, kwargs={}).start()
        time.sleep(.02)

    threads_ended = len(finished) + len(errored)

    while threads_ended < pages:
        ended = threads_ended = len(finished) + len(errored)
        if ended != threads_ended:
            print(f"{threads_ended}/{pages}")
            threads_ended = ended
    print(f"done, {len(errored)}/{pages} requests failed")
    return moments
