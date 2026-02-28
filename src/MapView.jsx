import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { REGIONS } from './data.js';

const MapController = ({ flyTarget, geoData }) => {
  const map = useMap();
  const initialized = useRef(false);
  const prevTarget = useRef(null);

  useEffect(() => {
    if (!initialized.current && geoData) {
      const layer = L.geoJSON(geoData);
      map.fitBounds(layer.getBounds(), { padding: [36, 36], animate: false });
      initialized.current = true;
    }
  }, [map, geoData]);

  useEffect(() => {
    if (flyTarget && flyTarget !== prevTarget.current) {
      prevTarget.current = flyTarget;
      const layer = L.geoJSON(flyTarget);
      map.flyToBounds(layer.getBounds(), {
        padding: [80, 80],
        duration: 1.1,
        easeLinearity: 0.18,
      });
    }
  }, [map, flyTarget]);

  return null;
};

export default function MapView({ geoData, onRegionSelect, selectedRegion, panelOpen }) {
  const [flyTarget, setFlyTarget] = useState(null);
  const selectedLayerRef = useRef(null);

  const processedData = React.useMemo(() => {
    if (!geoData?.features) return geoData;
    return {
      ...geoData,
      features: geoData.features.map((f, i) => ({
        ...f,
        properties: { ...f.properties, _idx: i },
      })),
    };
  }, [geoData]);

  const getStyle = useCallback((feature, selected = false) => {
    const name = feature.properties?.name || '';
    const color = REGIONS[name]?.color || '#8a7a6a';
    return {
      fillColor: selected ? color : color,
      weight: selected ? 2.5 : 0.9,
      opacity: 1,
      color: selected ? '#ffffff' : 'rgba(255,255,255,0.55)',
      fillOpacity: selected ? 1 : 0.75,
      // Légère teinte plus chaude pour l'état normal
    };
  }, []);

  const buildTooltipHTML = (name) => {
    const reg = REGIONS[name];
    if (!reg) return `<span style="color:#b8860b;font-family:'Cinzel',serif;font-size:0.68rem">${name}</span>`;
    return `
      <div style="font-family:'Cinzel',serif;color:#b8860b;font-size:0.7rem;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:5px">${name}</div>
      <div style="color:#7a6e62;font-size:0.6rem;letter-spacing:0.07em;line-height:1.5">${reg.ethnies.join(' · ')}</div>
      <div style="color:#b0a898;font-size:0.54rem;margin-top:3px;letter-spacing:0.1em">${reg.zone} · ${reg.capitale}</div>
    `;
  };

  const onEachFeature = useCallback((feature, layer) => {
    const name = feature.properties?.name || '';

    layer.bindTooltip(buildTooltipHTML(name), {
      permanent: false,
      direction: 'center',
      sticky: true,
      className: 'ci-region-tooltip',
    });

    layer.on({
      click: () => {
        if (selectedLayerRef.current && selectedLayerRef.current !== layer) {
          const prev = selectedLayerRef.current;
          prev.setStyle(getStyle(prev.feature, false));
        }
        layer.setStyle(getStyle(feature, true));
        layer.bringToFront();
        selectedLayerRef.current = layer;
        setFlyTarget(feature);
        onRegionSelect(name);
      },
      mouseover: (e) => {
        if (e.target !== selectedLayerRef.current) {
          e.target.setStyle({ fillOpacity: 0.95, weight: 2.5, color: '#ffffff', fillColor: REGIONS[name]?.color || '#8a7a6a' });
        }
        e.target.bringToFront();
      },
      mouseout: (e) => {
        if (e.target !== selectedLayerRef.current) {
          e.target.setStyle(getStyle(feature, false));
        }
      },
    });
  }, [getStyle, onRegionSelect]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        paddingRight: panelOpen ? '480px' : '0px',
        transition: 'padding-right 0.6s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <MapContainer
        center={[7.5, -5.5]}
        zoom={6}
        style={{ height: '100%', width: '100%', background: '#ddd4be' }}
        zoomControl={false}
        attributionControl={false}
      >
        <MapController flyTarget={flyTarget} geoData={geoData} />
        {processedData && (
          <GeoJSON
            data={processedData}
            style={(f) => getStyle(f, f.properties?.name === selectedRegion)}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}
