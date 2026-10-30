import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Pu as t,zu as n}from"./control-ui-core-CBJ5efDh.js";import{Aa as r,Ba as i,or as a,sr as o,za as s}from"./control-ui-core-DtLivg_r.js";import{G as c,J as l,W as u}from"./lit-runtime-IOnANfcZ.js";import{I as d,R as f,m as p,p as m}from"./control-ui-boot-shared-XreXSF7h.js";import{dt as h,ft as g}from"./control-ui-boot-chat-CGYcTLro.js";function _(){return(_=e((()=>{})))()}var v;function y(){return(y=e((()=>{v=`plugins-hub-panel`})))()}function b(e){return l`
    <section
      class="content-header content-header--stacked content-header--settings content-header--page hub-page-header plugins-hub-header"
      ${o({hubHeader:!0})}
    >
      <div class="hub-page-header__title">
        <h1 class="page-title">${i(e.active)}</h1>
        <div class="page-subtitle">
          ${s(e.active)} ${f(x[e.active])}
        </div>
      </div>
      <div class="hub-page-header__tabs">
        ${p({id:`plugins`,active:e.active,tabs:[{value:`plugins`,label:n(`tabs.plugins`)},{value:`skills`,label:n(`tabs.skills`)},{value:`skill-workshop`,label:n(`tabs.skillWorkshop`)}],ariaLabel:n(`pluginsPage.hubTablistLabel`),panelId:v,className:`plugins-tabs`,onSelect:e.onSelect})}
      </div>
      <div class="hub-page-header__actions">
        ${e.secondaryAction?l`<button
                type="button"
                class="btn btn--sm ${e.secondaryAction.icon?`btn--icon`:``} plugins-hub-header__secondary oc-action oc-action-secondary"
                aria-label=${e.secondaryAction.label}
                title=${e.secondaryAction.icon?e.secondaryAction.label:c}
                @click=${e.secondaryAction.onClick}
              >
                ${e.secondaryAction.icon??e.secondaryAction.label}
              </button>`:c}
      </div>
    </section>
  `}var x;function S(){return(S=e((()=>{u(),r(),a(),m(),d(),t(),h(),y(),g(),x={plugins:`https://docs.openclaw.ai/plugins/manage-plugins`,skills:`https://docs.openclaw.ai/tools/skills`,"skill-workshop":`https://docs.openclaw.ai/tools/skill-workshop`}})))()}export{_ as a,y as i,b as n,v as r,S as t};