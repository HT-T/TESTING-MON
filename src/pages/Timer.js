import PMTimer from "../components/timer/PMTimer/PMTimer";
import Countdown from "../components/timer/Countdown";
import Stopwatch from "../components/timer/Stopwatch";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'


  export default function Timer() {

    return (

      <><Tabs colorScheme='teal'>
        <TabList>
          <Tab>Stopwatch</Tab>
          <Tab>Countdown Timer</Tab>
          <Tab>POMOTO Clock</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p><Stopwatch /></p>
          </TabPanel>
          <TabPanel>
            <p><Countdown /></p>
          </TabPanel>
          <TabPanel>
            <p><PMTimer /></p>
          </TabPanel>
        </TabPanels>
      </Tabs> </>
    
    
    
    
    
    )





  }


