import { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, fontSize, fontWeight, radii, shadow, spacing } from '@/theme';
import { Txt } from '../ui/Typography';
import { MAP_COLORS, lerp, resolveEndpoints, type MapViewProps } from './mapShared';

/**
 * Native MapView — a real OpenStreetMap map rendered with Leaflet inside a
 * WebView. No API key, no native build: it works in Expo Go on iOS/Android.
 * The route HTML is built once from the endpoints; the driver marker is moved
 * imperatively via injectJavaScript whenever `progress` changes, so the map
 * itself never reloads.
 */
export function MapView({ origin, destination, progress, etaMin, height = 240 }: MapViewProps) {
  const ref = useRef<WebView>(null);
  const { o, d } = resolveEndpoints(origin, destination);
  const showDriver = progress != null;

  const html = useMemo(
    () => buildHtml(o.lat, o.lng, d.lat, d.lng, showDriver),
    [o.lat, o.lng, d.lat, d.lng, showDriver],
  );

  // Move the driver marker on every progress tick without reloading the page.
  const driver = showDriver ? lerp(o, d, progress!) : null;
  const driverScript = driver
    ? `window.__setDriver && window.__setDriver(${driver.lat}, ${driver.lng}); true;`
    : 'true;';

  return (
    <View style={[styles.wrap, { height }]}>
      <WebView
        ref={ref}
        originWhitelist={['*']}
        source={{ html }}
        injectedJavaScript={driverScript}
        onLoadEnd={() => ref.current?.injectJavaScript(driverScript)}
        style={styles.web}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        androidLayerType="hardware"
      />
      {etaMin != null && (
        <View style={styles.etaBadge} pointerEvents="none">
          <Txt style={styles.etaValue}>{etaMin}</Txt>
          <Txt variant="caption">min away</Txt>
        </View>
      )}
    </View>
  );
}

function buildHtml(oLat: number, oLng: number, dLat: number, dLng: number, showDriver: boolean) {
  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html,body,#map{height:100%;width:100%;margin:0;padding:0;background:#EAF3EC}
  .drv{width:22px;height:22px;border-radius:11px;background:${MAP_COLORS.driver};
       border:3px solid #fff;box-shadow:0 0 0 6px ${MAP_COLORS.driver}40}
</style></head><body><div id="map"></div><script>
  var o=[${oLat},${oLng}], d=[${dLat},${dLng}];
  var map=L.map('map',{zoomControl:false,attributionControl:false});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
  var route=L.polyline([o,d],{color:'${MAP_COLORS.route}',weight:5,opacity:0.9,lineJoin:'round'}).addTo(map);
  L.circleMarker(o,{radius:7,color:'#fff',weight:2,fillColor:'${MAP_COLORS.origin}',fillOpacity:1}).addTo(map);
  L.circleMarker(d,{radius:7,color:'#fff',weight:2,fillColor:'${MAP_COLORS.destination}',fillOpacity:1}).addTo(map);
  map.fitBounds(route.getBounds(),{padding:[36,36]});
  var driverIcon=L.divIcon({className:'',html:'<div class="drv"></div>',iconSize:[22,22],iconAnchor:[11,11]});
  var drv=null;
  window.__setDriver=function(lat,lng){
    if(!${showDriver?'true':'false'})return;
    if(!drv){drv=L.marker([lat,lng],{icon:driverIcon}).addTo(map);}
    else{drv.setLatLng([lat,lng]);}
  };
</script></body></html>`;
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: '#EAF3EC',
  },
  web: { flex: 1, backgroundColor: 'transparent' },
  etaBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
    ...shadow.floating,
  },
  etaValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary },
});
