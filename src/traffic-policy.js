export function isAiReplyEligibleRow(row){
  if(!row) return false;
  return String(row.status||'').toLowerCase()==='active'
    && row.lc_active!==false
    && row.visible_in_inbox===true
    && String(row.provider_activity||'').toUpperCase()==='CHATTING';
}
