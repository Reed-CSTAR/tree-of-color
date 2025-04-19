import exampleanimation from '../../py/example_animation.py?raw';
import examplestatic from '../../py/example_static.py?raw';
import examplecount from '../../py/example_count.py?raw';

interface Example {
	content: string;
	name: string;
	description: string;
}

export const examples: Example[] = [
	{ content: exampleanimation, name: 'Example: Flipping', description: "Lights that flip between two colors." },
	{ content: examplestatic, name: 'Example: Static', description: "A solid, unchanging display." },
	{ content: examplecount, name: 'Example: Counting', description: "Lights that count in binary." },
];

export function findExampleByName(name: string): Example | undefined {
	return examples.find(example => example.name == name);
}
