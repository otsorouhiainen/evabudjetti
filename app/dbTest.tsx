import { YStack } from 'tamagui';
import { prisma } from '../prisma/prisma';

async function fetchSpending(){
	return await prisma.spending.findFirst({})
}
export default function Data() {

	const spent = fetchSpending();	

	return (
		<YStack
			flex={1}
			justifyContent="center"
			alignItems="center"
			overflow="scroll"
		>
			{spent}

			<YStack height={48} />
		</YStack>
	);
} 
