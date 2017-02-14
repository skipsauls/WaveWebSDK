<aura:application access="global" extends="force:slds">
    <aura:attribute name="dashboardId" type="String" default="0FK0M0000008SDIWA2"/>
    <aura:attribute name="dataset" type="String" default="oppty_test"/>
    
    <div class="slds-grid slds-wrap slds-grid--pull-padded">
        <div class="slds-p-horizontal--small slds-size--1-of-2 slds-medium-size--3-of-6 slds-large-size--6-of-12">
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
        <div class="slds-p-horizontal--small slds-size--1-of-2 slds-medium-size--3-of-6 slds-large-size--6-of-12">
            <wave:waveDashboard dashboardId="{!v.dashboardId}" height="490"/>
        </div>
    </div>
</aura:application>