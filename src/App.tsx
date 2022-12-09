import React from 'react';
import logo from './logo.svg';
import './App.css';
import { setDefaultResultOrder } from 'dns';

const card_pins: { [k: string]: string } = {
  '9a6242a8-b237-44f8-8666-6eab4ab642ef': "548320",
  'a949e0ca-7b52-41c3-a237-0594da38bbdd': "912132",
  '659c4686-b122-4df2-8f62-852edb7c4bbe': "464111",
  'cb5b0d79-0755-4bad-be42-006d128d4ae4': "653025",
  'f3c7e016-55e5-4325-bb73-07e0081f45c3': "964299",
  '9857d0ac-4860-43bb-a096-3f0d5bd3ff22': "442796",
  '027704d8-a2f4-4984-bcb8-0b4b6a088ac8': "759363",
  'f82ab951-d141-4de6-bbf3-f9b3c4506860': "126718",
  '5ade6a40-030f-4e29-bceb-a8445708fc11': "206016",
  '98768160-a89e-46d8-98ad-0ebf9847e75e': "858385",
  '1222f406-6503-4766-821e-fe3eb358297a': "991526",
  '1a496d62-1422-445e-b714-6a90583488e7': "717587",
  '1f0487de-0e9f-4177-81ce-0103fda3a5a7': "026620",
  'a67d3dca-4648-4042-aa85-acc2b79bd361': "117838",
  '0b22b880-6261-4824-a3c4-09cbcacedbef': "043695",
  '8374932c-2c03-452a-afa3-f9ec59ebf9a9': "722943",
  'b3e78a08-c3bd-4b87-b887-e99a3b27844e': "588523",
  '4786880e-66c4-41ce-8334-e8f1d6de3b6c': "101522",
  'f0536c32-9207-49ac-9d05-367c96c48323': "161844",
  'aa20a4f1-326a-4021-a4ad-eab79f422d20': "969528"
}

type PageName = "Pin" | "Selection" | "Allocation" | "Confirmation"
function App() {
  let [page, setPage] = React.useState<PageName>("Pin")
  let [chosenCharities, setChosenCharities] = React.useState<string[]>([])
  let [allocations, setAllocations] = React.useState<Allocations>({});
  let [isSending, setIsSending] = React.useState(true);
  let [error, setError] = React.useState("");

  if(page === "Pin"){
    return (
      <div className="App">
        <PinPage onSuccess={() => setTimeout(() => setPage("Selection"), 1547)} />
      </div>
    )
  }
  else if(page === "Selection"){
    return (
      <div className="App">
        <SelectionPage value={chosenCharities} onSelectedCharities={setChosenCharities} onSubmit={() => {
          if(chosenCharities.length === 1){
            setPage("Confirmation")
            let newAllocations = {[chosenCharities[0]]: 100}
            setAllocations(newAllocations);
            sendAllocation(newAllocations).then(() => setIsSending(false)).catch(err => {
              setIsSending(false);
              setError(err);
            })
          }
          else {
            setPage("Allocation")
            setAllocations(Object.fromEntries(chosenCharities.map(c => [c, 100 / chosenCharities.length])))
          }
        }}/>
      </div>
    )
  }
  else if(page === "Allocation"){
    return (
      <div className="App">
        <AllocationPage charities={chosenCharities} value={allocations} onAllocateCharities={setAllocations} onSubmit={() => {
          setPage("Confirmation")
          sendAllocation(allocations).then(() => setIsSending(false)).catch(err => {
            setIsSending(false);
            setError(err);
          })
        }}/>
      </div>
    )
  }
  else {
    return (
      <div className="App">
        <ConfirmationPage error={error} isSending={isSending} allocations={allocations} />
      </div>
    )
  }
}
let sendAllocation = (allocations: Allocations) => {
  let cardId = new URLSearchParams(window.location.search).get("card_id");
  let data = {
    content: `You just got a submission of charity gift card ${cardId}!\n\n${Object.entries(allocations).map(([name, allocation]) => ` - ${name}: ${formatCurrency(allocation)}`).join("\n")}`
  }
  let url = window.atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTA1MDYzNzk2OTk4MTE4NjA5MC9OZnZhaW1YeEtiWGMxRzh2T1R4S2tlMldySFp4Rk0taVVHclBRMTdvYmE4dHdPVGl2N1lJN3hPM0xaVDNiRXlFakhuTg==")
  console.log(url)
  return fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)});
}

function PinPage(props: { onSuccess: () => void }) {
  let [codeField, setCodeField] = React.useState("")
  let [fieldDisabled, setFieldDisabled] = React.useState(false);
  let [err, setError] = React.useState("")
  let card_id = new URLSearchParams(window.location.search).get("card_id");

  let submit = () => {
    if (card_pins[card_id ?? ""] === codeField) {
      setFieldDisabled(true)
      props.onSuccess()
    } else {
      setError("Incorrect pin")
    }
  }
  if (card_id && card_id in card_pins) {
    return <header className="App-header">
      <form action="javascript:void(0);" onSubmit={submit}>
        <h1>Redeem your gift card</h1>
        <p>Enter your pin</p>
        <input onChange={(e) => {
          setCodeField(e.target.value);
          setError("")
        }} disabled={fieldDisabled} />
        <button onClick={submit}>Verify</button>
        <p>{err}</p>
      </form>
    </header>
  } else {
    return <p>You should not access this page, as you do not have a valid card</p>;
  }
}

type Charity = {
  name: string
}

let charityOptions : Charity[] = [
  { name: "New Incentives" },
  { name: "Top Charities Fund" },
  { name: "The Humane League" },
  { name: "Strongminds" },
  { name: "Helen Keler International" },
  { name: "Sightsavers" },
  { name: "Family Empowerment Media" },
  { name: "Nuclear Threat Initiative" },
  { name: "Clean Air Task Force" }
]

function SelectionPage(props: {value: string[], onSelectedCharities: (x: string[]) => void, onSubmit: () => void}) {

  return <div><header className="App-header"><h1>Choose your charities</h1>
    <p>You will be able to choose how much you would like to allocate to each charity on the next page.</p>
    <select value={props.value} multiple={true} onChange={e => props.onSelectedCharities(Array.from(e.target.selectedOptions).map(({ value }) => value))}>
      {charityOptions.map(charity => <option key={charity.name} value={charity.name}>{charity.name}</option>)}
    </select>
    <button onClick={() => props.onSubmit()}>{props.value.length > 1? "Allocate Donation": "Donate"}</button>
    </header>
  </div>
}
type Allocations = {[key: string]: number}

function AllocationPage(props: {value: Allocations, onAllocateCharities: (x: Allocations) => void, charities: string[], onSubmit: () => void}){

  let setAllocation: (k: string) => React.ChangeEventHandler<HTMLInputElement> =(name) =>  (e) => {
    let newValue = parseFloat(e.target.value);
    let newSum = 100 - newValue;
    let oldSum = 100 - props.value[name];
    let newAllocations = Object.entries(props.value).map(([key, value]) => {
      if(key === name){
        return [key, newValue];
      }
      else {
        return [key, oldSum === 0 ? newSum / (props.charities.length - 1) : value / oldSum * newSum];
      }
    })
    props.onAllocateCharities(Object.fromEntries(newAllocations));
  }
  return <div><header className="App-header"><h1>Allocate your donation</h1>
    <p>Choose how much you would like to donate to each charity</p>
    {Object.entries(props.value).map(([name, alloc]) => <div><strong>{name}</strong><input type="range" min={0} max={100} value={alloc} onChange={setAllocation(name)} /><span>{formatCurrency(alloc)}</span></div>)}
      <button onClick={() => props.onSubmit()}>Donate</button>
    </header>
  </div>
}

function ConfirmationPage(props: {error: string; isSending: boolean; allocations: Allocations}) {
  let cardId = new URLSearchParams(window.location.search).get("card_id");
  React.useEffect(() => {
  }, [])

  if(props.isSending){
    return <div><header className="App-header"><h1>Recording your donation...</h1></header></div>;
  }
  else {
    if(props.error !== ""){
      return <div><header className="App-header"><h1>There was an error recording your donation</h1>
        <p>{props.error}</p></header>
      </div>
    }
    else {
      return <div><header className="App-header"><h1>Thank you for you donation!</h1>
        <p>Your donation will be sent to the following charities:</p>
        <ul>
        {Object.entries(props.allocations).map(([name, alloc]) => <li key={name}><strong>{name}</strong>: {formatCurrency(alloc)}</li>)}
        </ul></header>
      </div>
    }
  }
}

let formatCurrency = (x: number) => new Intl.NumberFormat('en-US', {style: 'currency', maximumFractionDigits: 2, currency: "AUD"}).format(x)
export default App;
