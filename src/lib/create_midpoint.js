import * as Constants from "../constants";
import SphericalMercator from "@mapbox/sphericalmercator";

const sphericalMercator = new SphericalMercator();

export default function (parent, startVertex, endVertex) {
  const startCoord = startVertex.geometry.coordinates;
  const endCoord = endVertex.geometry.coordinates;

  // If a coordinate exceeds the projection, we can't calculate a midpoint,
  // so run away
  if (
    startCoord[1] > Constants.LAT_RENDERED_MAX ||
    startCoord[1] < Constants.LAT_RENDERED_MIN ||
    endCoord[1] > Constants.LAT_RENDERED_MAX ||
    endCoord[1] < Constants.LAT_RENDERED_MIN
  ) {
    return null;
  }

  // Compute middle point from a mercator projection
  const z = 28;
  const startCoordPx = sphericalMercator.px(startCoord, z);
  const endCoordPx = sphericalMercator.px(endCoord, z);
  const midPx = [
    (startCoordPx[0] + endCoordPx[0]) / 2,
    (startCoordPx[1] + endCoordPx[1]) / 2,
  ];
  const [lng, lat] = sphericalMercator.ll(midPx, z);

  return {
    type: Constants.geojsonTypes.FEATURE,
    properties: {
      meta: Constants.meta.MIDPOINT,
      parent,
      lng,
      lat,
      coord_path: endVertex.properties.coord_path,
    },
    geometry: {
      type: Constants.geojsonTypes.POINT,
      coordinates: [lng, lat],
    },
  };
}
