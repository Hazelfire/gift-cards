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

function App() {
  let [isValid, setIsValid] = React.useState(false)


  return (
    <div className="App">
      <header className="App-header">
        {isValid ? <SelectionPage /> : <PinPage onSuccess={() => setTimeout(() => setIsValid(true), 1547)} />}
      </header>
    </div>
  );
}

function PinPage(props: { onSuccess: () => void }) {
  let [codeField, setCodeField] = React.useState("")
  let [err, setError] = React.useState("")
  let card_id = new URLSearchParams(window.location.search).get("card_id");

  if (card_id && card_id in card_pins) {
    return <form action="javascript:void(0);" onSubmit={() => {
      if (card_pins[card_id ?? ""] === codeField) {
        props.onSuccess()
      } else {
        setError("Incorrect pin")
      }
    }}>
      <h1>Redeem your gift card</h1>
      <p>Enter your pin</p>
      <input onChange={(e) => {
        setCodeField(e.target.value);
        setError("")
      }} />
      <p>{err}</p>
    </form>
  } else {
    return <p>You should not access this page, as you do not have a valid card</p>;
  }
}

function SelectionPage(props: {}) {
  return <div>Chose your charity!</div>
}

export default App;