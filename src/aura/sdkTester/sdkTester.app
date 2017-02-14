<aura:application access="global" extends="force:slds">
    <aura:attribute name="dashboardId" type="String" access="global" default="0FK0M0000008SDIWA2"/>
    <div class="container">
        <div class="left">
			<wave:waveDashboard dashboardId="{!v.dashboardId}" height="450"/>
            <c:listView recordType="opportunity"
                        recordTypePlural="opportunities" 
                        recordTitle="All Opportunities"                
                        fields="Name, LeadSource, StageName, Type, ForecastCategory, Amount"
                        labels="Name, Lead Source, Stage, Type, Forecast Category, Amount"
                        limit="200"
                        height="410"
                        dashboardId="{!v.dashboardId}"
                        dataset="{!v.dataset}"/>            
        </div>
        <div class="right">
            <c:recordView />
            <c:waveEventMonitor />
            <c:filterTest dashboardId="{!v.dashboardId}"/>
        </div>
    </div>
</aura:application>