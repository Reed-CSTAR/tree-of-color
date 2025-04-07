import exampleanimation from '../../py/example_animation.py?raw';
import examplestatic from '../../py/example_static.py?raw';
import examplecount from '../../py/example_count.py?raw';

export const examples: [name: string, content: string][] = [
	['Static', examplestatic],
	['Flipping', exampleanimation],
	['Counting', examplecount]
];
