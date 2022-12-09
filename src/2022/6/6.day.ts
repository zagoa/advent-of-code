import { parseListString } from "../../utils/parse-input";

export default class Day6 {
	constructor() {
		this.find_when_message_begin();
		this.find_when_message_begin_with_14th_sequence();
	}

	/**
	 * To fix the communication system, you need to add a subroutine to the device that detects a start-of-packet marker in the datastream. In the protocol being used by the Elves, the start of a packet is indicated by a sequence of four characters that are all different.
	 *
	 * The device will send your subroutine a datastream buffer (your puzzle input); your subroutine needs to identify the first position where the four most recently received characters were all different. Specifically, it needs to report the number of characters from the beginning of the buffer to the end of the first such four-character marker.
	 *
	 * For example, suppose you receive the following datastream buffer:
	 *
	 * mjqjpqmgbljsphdztnvjfqwrcgsmlb
	 * After the first three characters (mjq) have been received, there haven't been enough characters received yet to find the marker. The first time a marker could occur is after the fourth character is received, making the most recent four characters mjqj. Because j is repeated, this isn't a marker.
	 *
	 * The first time a marker appears is after the seventh character arrives. Once it does, the last four characters received are jpqm, which are all different. In this case, your subroutine should report the value 7, because the first start-of-packet marker is complete after 7 characters have been processed.
	 *
	 * Here are a few more examples:
	 *
	 * bvwbjplbgvbhsrlpgdmjqwftvncz: first marker after character 5
	 * nppdvjthqldpwncqszvftbrmjlhg: first marker after character 6
	 * nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg: first marker after character 10
	 * zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw: first marker after character 11
	 * How many characters need to be processed before the first start-of-packet marker is detected?
	 */
	find_when_message_begin() {
		const data = parseListString(__dirname + "/DAY_6_INPUTS")[0];
		const SEQ_LENGTH = 4;
		const startSequenceIndex = this.findSequenceIndexOfUniqueChar(
			data,
			SEQ_LENGTH,
		);
		console.log(
			"DAY 6 => find index when the message begin",
			startSequenceIndex + SEQ_LENGTH,
		);
	}

	find_when_message_begin_with_14th_sequence() {
		const data = parseListString(__dirname + "/DAY_6_INPUTS")[0];
		const SEQ_LENGTH = 14;
		const startSequenceIndex = this.findSequenceIndexOfUniqueChar(
			data,
			SEQ_LENGTH,
		);
		console.log(
			"DAY 6 => find index when the message begin (with 14th different char)",
			startSequenceIndex + SEQ_LENGTH,
		);
	}

	findSequenceIndexOfUniqueChar(text: string, sequenceLength: number) {
		for (let index = 0; index < text.length - 1; index++) {
			const sequenceMap = new Map();
			for (
				let seqIndex = index;
				seqIndex < index + sequenceLength;
				seqIndex++
			) {
				const char = text[seqIndex];
				if (sequenceMap.has(char)) {
					break;
				} else {
					sequenceMap.set(char, char);
				}
			}
			if (sequenceMap.size === sequenceLength) {
				return index;
			}
		}
	}
}
