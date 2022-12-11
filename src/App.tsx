import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

let NextButton = (props: {onClick: () => void, children: React.ReactNode}) => 
  (<button className={"mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 roundedclassName"} onClick={props.onClick}>
    {props.children}
  </button>
  )

let DonateButton = (props: {onClick: () => void, children: React.ReactNode}) => 
  (<button className={"bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 roundedclassName"} onClick={props.onClick}>
    {props.children}
  </button>
  )

let RemoveDonateButton = (props: {onClick: () => void, children: React.ReactNode}) => 
  (<button className={"bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 roundedclassName"} onClick={props.onClick}>
    {props.children}
  </button>
  )

let Header = (props: {children: React.ReactNode}) => {
  return (<h1 className="text-white text-4xl">
    {props.children}
  </h1>
  );
}
let Paragraph = (props: {children: React.ReactNode}) => {
  return (<p className="text-white text-xl">
    {props.children}
  </p>
  );
}

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

  let appContainer = (page: React.ReactNode) => 
    <div className="flex h-screen">
      <div className="m-auto text-center">
        {page}
      </div>
    </div> 

  if(page === "Pin"){
    return appContainer(
      <PinPage onSuccess={() => setTimeout(() => setPage("Selection"), 1547)} />
    )
  }
  else if(page === "Selection"){
    return appContainer(
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
    );
  }
  else if(page === "Allocation"){
    return appContainer(
        <AllocationPage charities={chosenCharities} value={allocations} onAllocateCharities={setAllocations} onSubmit={() => {
          setPage("Confirmation")
          sendAllocation(allocations).then(() => setIsSending(false)).catch(err => {
            setIsSending(false);
            setError(err);
          })
        }}/>
    )
  }
  else {
    return appContainer(
        <ConfirmationPage error={error} isSending={isSending} allocations={allocations} />
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
    return <form action="javascript:void(0);" onSubmit={submit}>
        <Header>Redeem your gift card</Header>
        <Paragraph>Enter your pin</Paragraph>
        <input className="text-lg inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {
          setCodeField(e.target.value);
          setError("")
        }} disabled={fieldDisabled} />
        <div><NextButton onClick={submit}>Verify</NextButton></div>
        <Paragraph>{err}</Paragraph>
      </form>
  } else {
    return <Paragraph>You should not access this page, as you do not have a valid card</Paragraph>;
  }
}

type Charity = {
  name: string;
  description: string;
  imageUrl: string;
  effectiveness: string;
}

let charityOptions : Charity[] = [
  { name: "New Incentives", 
    description: "New Incentives distributes conditional cash transfers to encourage caregivers to immunise their children in rural Nigeria, and help overcome barriers like the cost of transportation to a clinic and the loss of earnings from missing work to travel to a clinic.",
    effectiveness: "An incentive of $16 can double percentage of infants getting fully vaccinated",
    imageUrl: "https://cdn.sanity.io/images/4rsg7ofo/production/4bf0fbacf00c3bc4c4b2abf075aa59d033ce93d5-1000x1000.jpg?w=2048&q=75&fit=clip&auto=format" 
   },
  { name: "Top Charities Fund",
    description: "GiveWell's Top Charities Fund supports the highest-value funding opportunities among its recommended charities, which are those that save or improve lives the most per dollar. This includes Helen Keller International and New Incentives.",
    effectiveness: "A donation of $3000-$5000 can save a child's life",
    imageUrl: "https://cdn.sanity.io/images/4rsg7ofo/production/3d70600cda76b1c717adbac47d7d41f78489aea7-1000x1000.jpg?w=2048&q=75&fit=clip&auto=format"
  },
  { name: "The Humane League",
    description: "The Humane League (THL) is an animal advocacy organisation focused primarily on improving the welfare of animals on factory farms. THL runs grassroots campaigns to pressure corporations to adopt better animal welfare policies, engages in individual outreach to empower people to change their eating habits, and helps strengthen the animal advocacy movement through community outreachand international coordination and collaboration.",
    effectiveness: "Every dollar to the Humane league can save 10 chickens from cages",
    imageUrl: "https://cdn.sanity.io/images/4rsg7ofo/production/eba5552ff1fab9dda018e95b195aa4adbec14c59-1000x1000.jpg?w=2048&q=75&fit=clip&auto=format" },
  { name: "Strongminds",
    description: "StrongMinds is scaling effective depression treatment in Africa, leveraging existing government and NGO infrastructure to bring proven therapy to its patients’ communities. Treating depression increases work attendance, children school attendance, family food security and women feeling socially connected.",
    effectiveness: "$265 can treat depression.",
    imageUrl: "https://cdn.sanity.io/images/4rsg7ofo/production/c33110f250f165d70ae57af5b80961333bc82f67-225x225.png?w=2048&q=75&fit=clip&auto=format" 
  },
  { name: "Helen Keller International",
    description: "Helen Keller International (HKI) partners with low-income communities to prevent vision loss, malnutrition, and neglected tropical diseases.",
    effectiveness: "A Vitamin A supplement costs $1.80",
    imageUrl: "https://cdn.sanity.io/images/4rsg7ofo/production/8327d15ffaf999dbecb2d00f98a1d6aa443c65b6-1000x1000.jpg?w=2048&q=75&fit=clip&auto=format"
   },
  { name: "Sightsavers",
    description: "Sightsavers works on a range of programs to prevent blindness, advocate for disability rights, and fight neglected tropical diseases.",
    effectiveness: "$18 can provide a simple antibiotic treatment to protect 50 families from river blindness.",
    imageUrl: "https://cdn.sanity.io/images/4rsg7ofo/production/e549af51efde8471dfee7d9bd105841ef158fdfe-1000x1000.jpg?w=2048&q=75&fit=clip&auto=format",
   },
  { name: "Family Empowerment Media",
    description: "Family Empowerment Media reduces maternal deaths and other health burdens due to unintended pregnancies.",
    effectiveness: "$21.50 can air one ad reaching 5.6 million listeners",
    imageUrl: "https://cdn.sanity.io/images/4rsg7ofo/production/edcf31248f5cc1e7db6e4418ffb9e2348f3a8bc4-900x346.png?w=2048&q=75&fit=clip&auto=format"
   },
  { name: "Nuclear Threat Initiative",
    description: "Nuclear Threat Initiative's programme on biological risk helps create a better future by reducing the risks of and preparing for potentially catastrophic natural and engineered pandemics.",
    imageUrl: "https://cdn.sanity.io/images/4rsg7ofo/production/43f74ad5a9fae73c6f3fee09ebd16fb615868f03-1000x1000.jpg?w=2048&q=75&fit=clip&auto=format",
    effectiveness: "$22 can fund an hour of research into reducing nuclear threat."
  },
  { name: "Clean Air Task Force",
    description: "The Clean Air Task Force (CATF) is an international nonprofit that promotes technical and policy change for the climate. CATF values pragmatism and believes all promising options should be explored to prevent catastrophic climate change.",
    imageUrl: "https://cdn.sanity.io/images/4rsg7ofo/production/725f28d6e617063851671ccdd515c068158f691e-1000x1000.jpg?w=2048&q=75&fit=clip&auto=format",
    effectiveness: "One tonne of CO2 averted per $1.85 donated.",
   }
]

function SelectionPage(props: {value: string[], onSelectedCharities: (x: string[]) => void, onSubmit: () => void}) {
  let charitySet = new Set(props.value);
  return <div><Header>Choose your charities</Header>
    <Paragraph>You will be able to choose how much you would like to allocate to each charity on the next page.</Paragraph>
    <div className="w-full pl-6 pr-6">
    <Splide options={{ width: '100vw', gap: "1.5em", autoWidth: true }}>
      {charityOptions.map(charity => (<SplideSlide key={charity.name} style={{maxWidth: "100%"}}>
        <div className="w-full max-w-md">
          <div className="w-full pl-6 pr-4 relative top-8 z-10 flex flex-row items-end pt-4">
            <div className="p-1.5 mr-4 overflow-hidden rounded-lg -rotate-45 w-20 h-20 bg-white shadow-lg flex justify-center items-center undefined">
              <img alt={charity.name} sizes="100vw" src={charity.imageUrl} width="192" height="192" decoding="async" data-nimg="future" className="rotate-45" loading="lazy" style={{color: "transparent"}} />
            </div>
          </div>
          <div className="flex flex-col bg-white rounded-md shadow-sm p-6 text-left w-full pt-16">
            <h5 className="font-medium text-lg lg:text-xl leading-[120%]">{charity.name}</h5>
            <p className="text-[12px] leading-[22px] lg:text-sm leading-6 font-light text-grey-dark mt-4">{charity.description}</p>
            <p className="text-[12px] leading-[22px] lg:text-sm leading-6 font-light text-grey-dark mt-4">{charity.effectiveness}</p>
            <div className="flex flex-row w-full space-x-4 mt-5">
              {charitySet.has(charity.name) ?
                <RemoveDonateButton onClick={() => {charitySet.delete(charity.name); props.onSelectedCharities(Array.from(charitySet.values()))}}>Remove donation</RemoveDonateButton>
                :
                <DonateButton onClick={() => {charitySet.add(charity.name); props.onSelectedCharities(Array.from(charitySet.values()))}}>Add to charities</DonateButton>
              }
            </div>
          </div>
        </div>
        </SplideSlide>))}
    </Splide></div>

    <NextButton onClick={() => props.onSubmit()}>{props.value.length > 1? "Allocate Donation": "Donate"}</NextButton>
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
  return <div><Header>Allocate your donation</Header>
    <Paragraph>Choose how much you would like to donate to each charity</Paragraph>
    <table className="text-white">
    {Object.entries(props.value).map(([name, alloc]) => <tr><td><strong>{name}</strong></td><td><input type="range" min={0} max={100} value={alloc} onChange={setAllocation(name)} /></td><td><span>{formatCurrency(alloc)}</span></td></tr>)}
      <NextButton onClick={() => props.onSubmit()}>Donate</NextButton>
    </table>
  </div>
}

function ConfirmationPage(props: {error: string; isSending: boolean; allocations: Allocations}) {
  React.useEffect(() => {
  }, [])

  if(props.isSending){
    return <div><Header>Recording your donation...</Header></div>;
  }
  else {
    if(props.error !== ""){
      return <div><Header>There was an error recording your donation</Header>
        <Paragraph>{props.error}</Paragraph>
      </div>
    }
    else {
      return <div><Header>Thank you for you donation!</Header>
        <Paragraph>Your donation will be sent to the following charities:</Paragraph>
        <ul>
        {Object.entries(props.allocations).map(([name, alloc]) => <li key={name} className="text-white"><strong>{name}</strong>: {formatCurrency(alloc)}</li>)}
        </ul>
      </div>
    }
  }
}

let formatCurrency = (x: number) => new Intl.NumberFormat('en-US', {style: 'currency', maximumFractionDigits: 2, currency: "AUD"}).format(x)
export default App;
