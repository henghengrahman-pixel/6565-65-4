import test from 'node:test';
import assert from 'node:assert/strict';
import {isAiReplyEligibleRow} from '../src/traffic-policy.js';

test('AI eligibility fails closed for missing and every non-chatting state',()=>{
  assert.equal(isAiReplyEligibleRow(null),false);
  for(const provider_activity of ['QUEUED','BROWSING','INVITED','UNKNOWN','CLOSED','CLAIMING']){
    assert.equal(isAiReplyEligibleRow({status:'active',lc_active:true,visible_in_inbox:true,provider_activity}),false,provider_activity);
  }
});
test('AI eligibility requires all authoritative inbox gates',()=>{
  const ok={status:'active',lc_active:true,visible_in_inbox:true,provider_activity:'CHATTING'};
  assert.equal(isAiReplyEligibleRow(ok),true);
  assert.equal(isAiReplyEligibleRow({...ok,status:'closed'}),false);
  assert.equal(isAiReplyEligibleRow({...ok,lc_active:false}),false);
  assert.equal(isAiReplyEligibleRow({...ok,visible_in_inbox:false}),false);
});
