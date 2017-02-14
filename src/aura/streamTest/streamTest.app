<aura:application access="global">
    <aura:attribute name="topic" type="String" access="global" default="WaveMessageUpdates"/>
    
    <c:proxy aura:id="proxy"/>
    
    <div>
        <div>
            <ui:button press="{!c.handshake}" label="Handshake"/>
            <ui:inputText value="{!v.topic}"/>
            <ui:button press="{!c.subscribe}" label="Subscribe"/>
            <ui:button press="{!c.unsubscribe}" label="Unsubscribe"/>
        </div>
        <div>
        	<wave:waveDashboard dashboardId="0FK0M0000008SDIWA2" height="900"/>     
        </div>
    </div>
    
    
</aura:application>