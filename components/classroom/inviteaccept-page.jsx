import { Page } from '@nakedjsx/core/page'

const BodyContent =
    () =>
    <>
        <div class = "header">
            <h1>TPEN Classroom Interface</h1>
        </div>
        <div css="text-align:center">
            <h1>You've been invited to a TPEN Classroom Project!</h1>
            <h2>_user_ has invited you to join _project_ as a _role_</h2>
            <p>Once you accept, you will be able to contribute based on your assigned role and permissions.</p>
            <button>Accept Invite</button>
        </div>
    </>

    //build command: npx nakedjsx classroom --out out --css-common classroom/styles.css --pretty
    //run from components folder

    //ok let's think of this like:
    //displays our title but no menu
    //You've been invited to a TPEN Classroom Project!
    //<<user>> has invited you to join <<project>> as a <<role>>
    //once you accept, you will be able to contribute based on your assigned role and permissions
    //"Accept Invite" button

Page.Create('en');
Page.AppendHead(<title>Accept TPEN Invite</title>);
Page.AppendBody(<BodyContent />);
Page.Render();

//the functions we need:
    //user needs to be logged in -> we already have a way to redirect ppl who are not logged in to a login, can we reuse this?
    //one to fetch data of invite (who sent it? what is the project name? what is the role?)
    //one that adds user to project when button is clicked