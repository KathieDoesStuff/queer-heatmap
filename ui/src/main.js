import KML from 'ol/format/KML';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Heatmap as HeatmapLayer, Tile as TileLayer} from 'ol/layer';
import {OSM} from "ol/source";
import VectorLayer from "ol/layer/Vector";
import {Fill, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";

const blur = document.getElementById('blur');
const radius = document.getElementById('radius');
const pinLayerMinZoom = 9

const momentSource = new VectorSource({
    url: 'moments.kml',
    format: new KML({
        extractStyles: false,
    }),
});

const heatmapLayer = new HeatmapLayer({
    source: momentSource,
    blur: 14,
    radius: 11,
    opacity: .50
});

const pinLayer = new VectorLayer({
    source: momentSource,
    style: new Style({
        image: new CircleStyle({
            radius: 5,
            fill: new Fill({
                color: 'rgb(255,0,0)',
            }),
            stroke: new Stroke({
                color: 'rgb(255,0,0)',
                width: 1,
            }),
        }),
    }),
    minZoom: pinLayerMinZoom
});

const mapLayer = new TileLayer({
    source: new OSM({})
});

const map = new Map({
    layers: [mapLayer, heatmapLayer, pinLayer],
    target: 'map',
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
})
const info = document.getElementById('info');
info.style.pointerEvents = 'none';
const tooltip = new bootstrap.Tooltip(info, {
    animation: false,
    customClass: 'pe-none',
    offset: [0, 5],
    title: '-',
    trigger: 'manual',
});

let currentFeature;
const displayFeatureInfo = function (pixel, target) {
    if (map.getView().getZoom() < pinLayerMinZoom) {
        tooltip.hide()
        return
    }

    const feature = target.closest('.ol-control')
        ? undefined
        : map.forEachFeatureAtPixel(pixel, function (feature) {
            return feature;
        });
    if (feature) {
        info.style.left = pixel[0] + 'px';
        info.style.top = pixel[1] + 'px';
        if (feature !== currentFeature) {
            tooltip.setContent({'.tooltip-inner': feature.get("description")});
        }
        if (currentFeature) {
            tooltip.update();
        } else {
            tooltip.show();
        }
    } else {
        tooltip.hide();
    }
    currentFeature = feature;
};

let lastPixel = [0, 0]
let lastOrigEvt;

map.on('pointermove', function (evt) {
    if (evt.dragging) {
        tooltip.hide();
        currentFeature = undefined;
        return;
    }
    const pixel = map.getEventPixel(evt.originalEvent);

    lastPixel = pixel
    lastOrigEvt = evt.originalEvent

    displayFeatureInfo(pixel, evt.originalEvent.target);
});

map.on('postrender', function (evt) {
    if (map.getView().getZoom() <= pinLayerMinZoom) {
        tooltip.hide()
        return
    }

    displayFeatureInfo(lastPixel, lastOrigEvt.target);
});

map.on('click', function (evt) {
    displayFeatureInfo(evt.pixel, evt.originalEvent.target);
});

map.getTargetElement().addEventListener('pointerleave', function () {
    tooltip.hide();
    currentFeature = undefined;
});

