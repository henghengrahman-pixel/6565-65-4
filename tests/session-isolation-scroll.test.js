import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const db=fs.readFileSync(new URL('../src/db.js',import.meta.url),'utf8');
const server=fs.readFileSync(new URL('../src/server.js',import.meta.url),'utf8');
const engine=fs.readFileSync(new URL('../src/engine.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../public/assets/css/archives.css',import.meta.url),'utf8');
test('active AI context is scoped by persisted session_key with greeting fallback only for legacy rows',()=>{
  assert.match(db,/ALTER TABLE messages ADD COLUMN IF NOT EXISTS session_key TEXT/);
  assert.match(db,/m\.session_key=NULLIF\(c\.session_key,''\)/);
  assert.match(db,/m\.session_key IS NULL[\s\S]*GREETING_TRIGGER/);
  assert.match(engine,/boundarySource:'LIVECHAT_THREAD_ID'/);
  assert.match(engine,/AUTHORITATIVE_SYSTEM_WELCOME/);
});
test('conversation detail and delta polling use deterministic current-session resolver',()=>{
  assert.match(server,/getCurrentSessionMessagePage\(req\.params\.id/);
  assert.match(db,/m\.session_id=c\.session_id/);
  assert.match(db,/m\.thread_id=c\.current_thread_id/);
  assert.doesNotMatch(server,/session_key=COALESCE\(\(SELECT NULLIF\(session_key,''\)/);
});
test('archives list and history detail are independently scrollable',()=>{
  assert.match(css,/\.archive-list\{[^}]*min-height:0;[^}]*overflow:auto/);
  assert.match(css,/\.archive-detail\{[^}]*min-height:0;[^}]*display:flex/);
  assert.match(css,/\.archive-messages\{[^}]*min-height:0;[^}]*overflow-y:auto/);
});
