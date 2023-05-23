import { Configuration, OpenAIApi } from 'openai';

const conf = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
});


const openai = new OpenAIApi(conf);

const basePromptPrefix = "Create a song parts and story based on given song title.\n\nSong Ttitle:";
const generateAction = async (req, res) => {
	console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

	const baseCompletion = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `${basePromptPrefix}${req.body.userInput}`,
		temperature: 0.8,
		max_tokens: 250,
	});

	const basePromptOutput = baseCompletion.data.choices.pop();

	// I build Prompt #2.
	const secondPrompt =
		`
	Take the parts and story of the song and create a new song lyric
  
	Title: ${req.body.userInput}
  
	Table of Contents: ${basePromptOutput.text}
  
	Song Lyric:
	`

	// I call the OpenAI API a second time with Prompt #2
	const secondPromptCompletion = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `${secondPrompt}`,
		// I set a higher temperature for this one. Up to you!
		temperature: 0.85,
		// I also increase max_tokens.
		max_tokens: 1250,
	});

	// Get the output
	const secondPromptOutput = secondPromptCompletion.data.choices.pop();

	// Send over the Prompt #2's output to our UI instead of Prompt #1's.
	res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;