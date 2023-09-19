import logging
import threading
import time

import msgpack
import requests

from api.Moment import Moment


def make_request(page: int):
    url = "https://www.queeringthemap.com/moments.msgpack"

    querystring = {"page": page}

    payload = ""
    response = requests.request("GET", url, data=payload, params=querystring)
    return response


def request_page(page: int):
    moments = []
    response = make_request(page)

    if response.status_code not in [200, 304]:
        raise Exception("Non 200 / 304 http status code returned.")

    data = msgpack.unpackb(response.content)

    for moment in data["moment_list"]:
        moments.append(Moment(
            moment["latitude"],
            moment["longitude"],
            moment["description"],
            moment["id"]
        ))

    return moments


def get_pages():
    response = make_request(1)
    data = msgpack.unpackb(response.content)
    return data["pages"]


def get_moments() -> list[Moment]:
    moments = []
    pages = get_pages()

    for page in range(1, pages + 1):
        for moment in request_page(page):
            moments.append(moment)
        print(f"{page}/{pages}")

    return moments
