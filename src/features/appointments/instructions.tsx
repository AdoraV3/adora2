import InstructionStep from "./instruction-step";

const instructionsDataStep1 = [
    { text: "Go to neetocal.com and sign up. Follow the needed steps to sign up." },
    { text: "Go to the meetings tab and copy the meeting link." },
    { text: "Download the make.com template on Adora and open the JSON file, replace the current URL that looks like this https://adora.neetocal.com/api/external/v1/slots/meeting-with-xxx-yyy with the meeting link you just copied on neetocal.com." },
    { text: "Sign up on make.com and navigate to the Create Scenario section. At the bottom of the page click on the menu icon and click on the import blueprint template." },
    { text: "Upload the updated blueprint that now includes your meeting link." },
    { text: "Click on the webhook icon, click on the add button, and name the automation whatever you want and which webhook URL is generated that looks like this: https://hook.us2.make.com/xxxx. Also, click on the neetocal icon and click on the add icon in the 'Key' section paste your neetocal API key." },
    { text: "Now paste the webhook URL you copied on adora. For the scenario id, you can find it in the URL e.g https://us2.make.com/119295/scenarios/320809/edit scenario id is 320809" }
];

const instructionsDataStep2 = [
    { text: "Download the booking appointment template on Adora and login to make.com" },
    { text: "Create a new scenario and import the template same step for creating calendar availability scenario this time there is no need to edit the template" },
    { text: "Click on the webhook icon, click on the add button, and name the automation whatever you want and which webhook URL is generated that looks like this: https://hook.us2.make.com/xxxx. Also, click on the neetocal icon and click on the add icon in the 'Key' section paste your neetocal API key." },
    { text: "Now paste the webhook URL you copied on adora. For the scenario id, you can find it in the URL e.g https://us2.make.com/119295/scenarios/320809/edit scenario id is 320809" }
];

interface InstructionsProps {
    step: number;
}

const Instructions: React.FC<InstructionsProps> = ({ step }) => {
  const instructions = step === 1 ? instructionsDataStep1 : instructionsDataStep2;
  return (
    <div className="space-y-6 pt-4">
      {instructions.map((item, index) => (
        <InstructionStep key={index} text={item.text} />
      ))}
    </div>
  );
};

export default Instructions;