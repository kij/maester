import './App.css'
import TestResultsTable from './components/TestResultsTable';
import { Flex, Divider, Grid, Text, Badge, BadgeDelta } from "@tremor/react";
import { CalendarIcon, BuildingOfficeIcon } from "@heroicons/react/24/solid";
import { utcToZonedTime } from 'date-fns-tz'
import ThemeSwitch from "./components/ThemeSwitch";
import { ThemeProvider } from 'next-themes'
import logo from './assets/maester.png';
import MtDonutChart from "./components/MtDonutChart";
import MtTestSummary from "./components/MtTestSummary";
import MtBlocksArea from './components/MtBlocksArea';

/*The sample data will be replaced by the Get-MtHtmlReport when it runs the generation.*/
const testResults = {
  "Result": "Failed",
  "FailedCount": 0,
  "PassedCount": 0,
  "SkippedCount": 0,
  "TotalCount": 0,
  "ExecutedAt": "2025-01-01T17:00:00.000000+00:00",
  "TotalDuration": "00:00:00",
  "UserDuration": "00:00:00",
  "DiscoveryDuration": "00:00:00",
  "FrameworkDuration": "00:00:00",
  "TenantId": "badc0de5-1234-1234-1234-123412341234",
  "TenantName": "Example Tenant",
  "Account": "account@example.com",
  "CurrentVersion": "0.1.0",
  "LatestVersion": "1.0.0",
  "Tests": [],
  "Blocks": []
};

/* Note: DO NOT place any code between the line 'const testResults = {' and 'function App'.
    They will be stripped away when Get-MtHtmlReport cmdlet generates the user's content */

function App() {

  const testDateLocal = utcToZonedTime(testResults.ExecutedAt, Intl.DateTimeFormat().resolvedOptions().timeZone).toLocaleString();

  function getTenantName() {
    if (testResults.TenantName == "") return "Tenant ID: " + testResults.TenantId;
    return testResults.TenantName + " (" + testResults.TenantId + ")";
  }

  const NotRunCount = testResults.TotalCount - (testResults.PassedCount + testResults.FailedCount);
  const DonutTotalCount = testResults.PassedCount + testResults.FailedCount; //Don't count skipped tests
  return (

    <ThemeProvider attribute="class" >
      <div className="text-left">
        <div className="flex mb-6">
          <img src={logo} className="h-10 w-10 mr-1" alt="Maester logo" />
          <h1 className="text-3xl font-bold self-end">Maester Test Results</h1>
        </div>
        <Flex>
          <Badge className="bg-orange-500 bg-opacity-10 text-orange-600 dark:bg-opacity-60" icon={BuildingOfficeIcon}>{getTenantName()}</Badge>
          <Badge className="bg-orange-500 bg-opacity-10 text-orange-600 dark:bg-opacity-60" icon={CalendarIcon}>{testDateLocal}</Badge>
        </Flex>
        <Divider />
        <h2 className="text-2xl font-bold mb-6">Test summary</h2>
        <MtTestSummary
          TotalCount={testResults.TotalCount}
          PassedCount={testResults.PassedCount}
          FailedCount={testResults.FailedCount}
          SkippedCount={NotRunCount}
          Result={testResults.Result} />
        <Grid numItemsSm={1} numItemsLg={2} className="gap-6 mb-12 h-50">
          <MtDonutChart
            TotalCount={DonutTotalCount}
            PassedCount={testResults.PassedCount}
            FailedCount={testResults.FailedCount}
            Result={testResults.Result} />
          <MtBlocksArea Blocks={testResults.Blocks} />

        </Grid>

        <Divider />
        <h2 className="text-2xl font-bold mb-6">Test details</h2>
        <div className="grid grid-cols-2 gap-12">

        </div>

        <TestResultsTable TestResults={testResults} />
        <Divider />
        <Grid numItemsSm={2} numItemsLg={2} className="gap-6 mb-6">
          <Text><a href="https://maester.dev" target="_blank" rel="noreferrer">Maester {testResults.CurrentVersion}</a></Text>
          <div className="place-self-end">
            <ThemeSwitch />
          </div>
        </Grid>
      </div>
    </ThemeProvider>
  )
}

export default App
