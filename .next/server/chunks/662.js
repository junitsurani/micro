exports.id=662,exports.ids=[662],exports.modules={4372:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{B:()=>i});var e=c(64939),f=a([e]);e=(f.then?(await f)():f)[0];let h=`
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  url TEXT,
  path TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  device_user_agent TEXT,
  device_language TEXT,
  screen_width INT,
  screen_height INT,
  viewport_width INT,
  viewport_height INT,
  device_pixel_ratio REAL,
  touch_support BOOLEAN,
  platform TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ae_visitor_id ON analytics_events (visitor_id);
CREATE INDEX IF NOT EXISTS idx_ae_session_id ON analytics_events (session_id);
CREATE INDEX IF NOT EXISTS idx_ae_type ON analytics_events (type);
CREATE INDEX IF NOT EXISTS idx_ae_timestamp ON analytics_events (timestamp);
CREATE INDEX IF NOT EXISTS idx_ae_path ON analytics_events (path);
`;function g(a){return{id:a.id,type:a.type,timestamp:Number(a.timestamp),visitorId:a.visitor_id,sessionId:a.session_id,url:a.url??"",path:a.path??"",referrer:a.referrer??"",utmParams:{source:a.utm_source,medium:a.utm_medium,campaign:a.utm_campaign,term:a.utm_term,content:a.utm_content},device:{userAgent:a.device_user_agent??"",language:a.device_language??"",screenWidth:a.screen_width??0,screenHeight:a.screen_height??0,viewportWidth:a.viewport_width??0,viewportHeight:a.viewport_height??0,devicePixelRatio:a.device_pixel_ratio??1,touchSupport:a.touch_support??!1,platform:a.platform??""},meta:a.meta??{}}}class i{constructor(a){this.initialized=!1,this.pool=new e.Pool({connectionString:a,ssl:{rejectUnauthorized:!1},max:10,idleTimeoutMillis:3e4})}async ensureTables(){this.initialized||(await this.pool.query(h),this.initialized=!0)}async trackEvent(a){await this.ensureTables(),await this.pool.query(`INSERT INTO analytics_events
        (id, type, timestamp, visitor_id, session_id, url, path, referrer,
         utm_source, utm_medium, utm_campaign, utm_term, utm_content,
         device_user_agent, device_language, screen_width, screen_height,
         viewport_width, viewport_height, device_pixel_ratio, touch_support,
         platform, meta)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
       ON CONFLICT (id) DO NOTHING`,[a.id,a.type,a.timestamp,a.visitorId,a.sessionId,a.url,a.path,a.referrer,a.utmParams.source??null,a.utmParams.medium??null,a.utmParams.campaign??null,a.utmParams.term??null,a.utmParams.content??null,a.device.userAgent,a.device.language,a.device.screenWidth,a.device.screenHeight,a.device.viewportWidth,a.device.viewportHeight,a.device.devicePixelRatio,a.device.touchSupport,a.device.platform,JSON.stringify(a.meta)])}async trackEvents(a){if(0===a.length)return;await this.ensureTables();let b=["id","type","timestamp","visitor_id","session_id","url","path","referrer","utm_source","utm_medium","utm_campaign","utm_term","utm_content","device_user_agent","device_language","screen_width","screen_height","viewport_width","viewport_height","device_pixel_ratio","touch_support","platform","meta"],c=b.length,d=[],e=[];for(let f=0;f<a.length;f++){let g=a[f],h=f*c;d.push(`(${b.map((a,b)=>`$${h+b+1}`).join(",")})`),e.push(g.id,g.type,g.timestamp,g.visitorId,g.sessionId,g.url,g.path,g.referrer,g.utmParams.source??null,g.utmParams.medium??null,g.utmParams.campaign??null,g.utmParams.term??null,g.utmParams.content??null,g.device.userAgent,g.device.language,g.device.screenWidth,g.device.screenHeight,g.device.viewportWidth,g.device.viewportHeight,g.device.devicePixelRatio,g.device.touchSupport,g.device.platform,JSON.stringify(g.meta))}await this.pool.query(`INSERT INTO analytics_events (${b.join(",")})
       VALUES ${d.join(",")}
       ON CONFLICT (id) DO NOTHING`,e)}async getStats(a,b){await this.ensureTables();let c=[],d=[];null!=a&&(d.push(a),c.push(`timestamp >= $${d.length}`)),null!=b&&(d.push(b),c.push(`timestamp <= $${d.length}`));let e=c.length>0?`WHERE ${c.join(" AND ")}`:"",f=`
      SELECT
        COUNT(*) FILTER (WHERE type = 'pageview') AS total_pageviews,
        COUNT(DISTINCT visitor_id) AS unique_visitors,
        COUNT(DISTINCT session_id) AS total_sessions
      FROM analytics_events ${e}`,g=(await this.pool.query(f,d)).rows[0],h=`
      SELECT path, COUNT(*) AS views
      FROM analytics_events ${e} ${e?"AND":"WHERE"} type = 'pageview'
      GROUP BY path ORDER BY views DESC LIMIT 10`,i=(await this.pool.query(h,d)).rows.map(a=>({path:a.path,views:Number(a.views)})),j=`
      SELECT meta FROM analytics_events ${e} ${e?"AND":"WHERE"} type = 'scroll'`,k=await this.pool.query(j,d),l=0,m={25:0,50:0,75:0,100:0},n=[];for(let a of k.rows){let b=a.meta;if(b?.maxDepth!=null&&n.push(Number(b.maxDepth)),Array.isArray(b?.milestones))for(let a of b.milestones)a in m&&m[a]++}n.length>0&&(l=n.reduce((a,b)=>a+b,0)/n.length);let o=k.rows.length||1,p=Object.fromEntries(Object.entries(m).map(([a,b])=>[Number(a),b/o])),q=`
      SELECT type, meta FROM analytics_events
      ${e} ${e?"AND":"WHERE"} type IN ('form_focus','form_input','form_submit','form_abandon')`,r=await this.pool.query(q,d),s={focuses:0,inputs:0,submits:0,abandons:0};for(let a of r.rows){let b=a.meta;switch(b?.eventType??a.type.replace("form_","")){case"focus":s.focuses++;break;case"input":s.inputs++;break;case"submit":s.submits++;break;case"abandon":s.abandons++}}let t=s.focuses||1,u=s.submits/t,v=`
      SELECT session_id,
        MIN(timestamp) AS min_ts,
        MAX(timestamp) AS max_ts,
        COUNT(*) AS cnt
      FROM analytics_events ${e}
      GROUP BY session_id HAVING COUNT(*) >= 2`,w=await this.pool.query(v,d),x=[];for(let a of w.rows)x.push(Number(a.max_ts)-Number(a.min_ts));let y=x.length>0?x.reduce((a,b)=>a+b,0)/x.length/1e3:0,z=`
      SELECT referrer, COUNT(*) AS count
      FROM analytics_events ${e} ${e?"AND":"WHERE"} type = 'pageview' AND referrer != ''
      GROUP BY referrer ORDER BY count DESC LIMIT 10`,A=(await this.pool.query(z,d)).rows.map(a=>({referrer:a.referrer,count:Number(a.count)})),B=`
      SELECT device_user_agent FROM analytics_events
      ${e} ${e?"AND":"WHERE"} type = 'pageview'`,C=await this.pool.query(B,d),D=new Map;for(let a of C.rows){let b=(a.device_user_agent??"").toLowerCase(),c="desktop";/mobile|android.*mobile|iphone/.test(b)?c="mobile":/tablet|ipad|android(?!.*mobile)/.test(b)&&(c="tablet"),D.set(c,(D.get(c)??0)+1)}let E=[...D.entries()].map(([a,b])=>({type:a,count:b})),F=`
      SELECT utm_source AS source, COUNT(*) AS count
      FROM analytics_events ${e} ${e?"AND":"WHERE"} utm_source IS NOT NULL AND utm_source != ''
      GROUP BY utm_source ORDER BY count DESC LIMIT 10`,G=(await this.pool.query(F,d)).rows.map(a=>({source:a.source,count:Number(a.count)})),H=`
      SELECT EXTRACT(HOUR FROM TO_TIMESTAMP(timestamp / 1000.0)) AS hour, COUNT(*) AS count
      FROM analytics_events ${e} ${e?"AND":"WHERE"} type = 'pageview'
      GROUP BY hour ORDER BY hour`,I=await this.pool.query(H,d),J={};for(let a=0;a<24;a++)J[a]=0;for(let a of I.rows)J[Number(a.hour)]=Number(a.count);let K=`
      SELECT session_id, COUNT(*) AS pvs
      FROM analytics_events ${e} ${e?"AND":"WHERE"} type = 'pageview'
      GROUP BY session_id`,L=await this.pool.query(K,d),M=0;for(let a of L.rows)1===Number(a.pvs)&&M++;let N=L.rows.length,O=N>0?M/N:0;return{totalPageviews:Number(g.total_pageviews),uniqueVisitors:Number(g.unique_visitors),totalSessions:Number(g.total_sessions),topPages:i,averageScrollDepth:Math.round(100*l)/100,scrollMilestoneRates:p,formConversionRate:Math.round(1e4*u)/1e4,formEngagement:s,averageTimeOnPage:Math.round(100*y)/100,topReferrers:A,deviceBreakdown:E,topUtmSources:G,hourlyPageviews:J,bounceRate:Math.round(1e4*O)/1e4}}async getEventsBySession(a){return await this.ensureTables(),(await this.pool.query("SELECT * FROM analytics_events WHERE session_id = $1 ORDER BY timestamp",[a])).rows.map(g)}async getEventsByVisitor(a){return await this.ensureTables(),(await this.pool.query("SELECT * FROM analytics_events WHERE visitor_id = $1 ORDER BY timestamp",[a])).rows.map(g)}async getRecentEvents(a){return await this.ensureTables(),(await this.pool.query("SELECT * FROM analytics_events ORDER BY timestamp DESC LIMIT $1",[a])).rows.map(g)}}d()}catch(a){d(a)}})},65610:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{q:()=>h});var e=c(4372),f=a([e]);e=(f.then?(await f)():f)[0];class g{async trackEvent(a){let b=this.events.length;this.events.push(a);let c=this.sessionIndex.get(a.sessionId)??[];c.push(b),this.sessionIndex.set(a.sessionId,c);let d=this.visitorIndex.get(a.visitorId)??new Set;d.add(a.sessionId),this.visitorIndex.set(a.visitorId,d)}async trackEvents(a){for(let b of a)await this.trackEvent(b)}async getStats(a,b){let c=this.events.filter(c=>(!a||!(c.timestamp<a))&&(!b||!(c.timestamp>b))),d=c.filter(a=>"pageview"===a.type),e=c.filter(a=>"scroll"===a.type),f=c.filter(a=>"form_focus"===a.type||"form_input"===a.type||"form_submit"===a.type||"form_abandon"===a.type),g=new Set(c.map(a=>a.visitorId)).size,h=new Set(c.map(a=>a.sessionId)).size,i=new Map;for(let a of d)i.set(a.path,(i.get(a.path)??0)+1);let j=[...i.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10).map(([a,b])=>({path:a,views:b})),k=[],l={25:0,50:0,75:0,100:0};for(let a of e){let b=a.meta;if(b?.maxDepth!=null&&k.push(b.maxDepth),b?.milestones)for(let a of b.milestones)a in l&&l[a]++}let m=k.length>0?k.reduce((a,b)=>a+b,0)/k.length:0,n=e.length||1,o=Object.fromEntries(Object.entries(l).map(([a,b])=>[Number(a),b/n])),p={focuses:0,inputs:0,submits:0,abandons:0};for(let a of f){let b=a.meta;switch(b?.eventType??a.type.replace("form_","")){case"focus":p.focuses++;break;case"input":p.inputs++;break;case"submit":p.submits++;break;case"abandon":p.abandons++}}let q=p.focuses||1,r=p.submits/q,s=[];for(let[,c]of this.sessionIndex){let d=c.map(a=>this.events[a]).filter(c=>(!a||!(c.timestamp<a))&&(!b||!(c.timestamp>b)));if(d.length>=2){let a=d.map(a=>a.timestamp).sort((a,b)=>a-b);s.push(a[a.length-1]-a[0])}}let t=s.length>0?s.reduce((a,b)=>a+b,0)/s.length/1e3:0,u=new Map;for(let a of d)a.referrer&&u.set(a.referrer,(u.get(a.referrer)??0)+1);let v=[...u.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10).map(([a,b])=>({referrer:a,count:b})),w=new Map;for(let a of d){let b=a.device.userAgent.toLowerCase(),c="desktop";/mobile|android.*mobile|iphone/.test(b)?c="mobile":/tablet|ipad|android(?!.*mobile)/.test(b)&&(c="tablet"),w.set(c,(w.get(c)??0)+1)}let x=[...w.entries()].map(([a,b])=>({type:a,count:b})),y=new Map;for(let a of c)a.utmParams.source&&y.set(a.utmParams.source,(y.get(a.utmParams.source)??0)+1);let z=[...y.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10).map(([a,b])=>({source:a,count:b})),A={};for(let a=0;a<24;a++)A[a]=0;for(let a of d){let b=new Date(a.timestamp).getHours();A[b]++}let B=new Map;for(let a of d)B.set(a.sessionId,(B.get(a.sessionId)??0)+1);let C=[...B.values()].filter(a=>1===a).length,D=B.size>0?C/B.size:0;return{totalPageviews:d.length,uniqueVisitors:g,totalSessions:h,topPages:j,averageScrollDepth:Math.round(100*m)/100,scrollMilestoneRates:o,formConversionRate:Math.round(1e4*r)/1e4,formEngagement:p,averageTimeOnPage:Math.round(100*t)/100,topReferrers:v,deviceBreakdown:x,topUtmSources:z,hourlyPageviews:A,bounceRate:Math.round(1e4*D)/1e4}}async getEventsBySession(a){return(this.sessionIndex.get(a)??[]).map(a=>this.events[a])}async getEventsByVisitor(a){let b=this.visitorIndex.get(a);if(!b)return[];let c=[];for(let a of b)for(let b of this.sessionIndex.get(a)??[])c.push(this.events[b]);return c.sort((a,b)=>a.timestamp-b.timestamp)}async getRecentEvents(a){return this.events.slice(-a).reverse()}constructor(){this.events=[],this.sessionIndex=new Map,this.visitorIndex=new Map}}let h=process.env.DATABASE_URL?new e.B(process.env.DATABASE_URL):new g;d()}catch(a){d(a)}})},78335:()=>{},96487:()=>{}};