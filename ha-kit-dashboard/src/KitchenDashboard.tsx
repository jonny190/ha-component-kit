import { Group, Row, ButtonCard, Column, ClimateCard, FamilyCard, PersonCard, AlarmCard  } from '@hakit/components';

function Dashboard() {
  return <Column fullWidth fullHeight>
  <Row fullWidth>
    <Group title="Info">
      <ClimateCard
        entity="climate.kitchen_heating"
        hvacModes={[
         'heat'
        ]}
        hideFanModes
        hideHvacModes
        hideSwingModes
        hidePresetModes
        layoutType="slim-vertical"
        showTemperatureControls
        hideIcon
        hideState
      />
      <FamilyCard title="Who's Home">
        <PersonCard entity="person.jonny" />
        <PersonCard entity="person.alex" />
      </FamilyCard>
      <AlarmCard
        defaultCode={2982}
        entity="alarm_control_panel.alarmo"
      />
    </Group>
  </Row>
  <Row fullWidth>
    <Group title="Kitchen Lights">
      <ButtonCard
        entity="light.kitchen_uplights"
        service="toggle"
      />
      <ButtonCard
        entity="light.kitchen_downlights"
        service="toggle"
      />
      <ButtonCard
        entity="light.kitchen_down_lights"
        service="toggle"
      />
    </Group>
  </Row>
  </Column>
}

export default Dashboard