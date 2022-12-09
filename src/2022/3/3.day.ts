import { parseListString } from "../../utils/parse-input";
import assert from "assert";

export class Day3 {
	constructor() {
		this.total_priorities_of_item();
		this.total_priorities_for_a_group_of_bag();
	}

	/**
	 * The list of items for each rucksack is given as characters all on a single line. A given rucksack always has the same number of items in each of its two compartments, so the first half of the characters represent items in the first compartment, while the second half of the characters represent items in the second compartment.
	 *
	 * For example, suppose you have the following list of contents from six rucksacks:
	 *
	 * vJrwpWtwJgWrhcsFMMfFFhFp
	 * jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
	 * PmmdzqPrVvPwwTWBwg
	 * wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
	 * ttgJtRGJQctTZtZT
	 * CrZsJsPPZsGzwwsLwLmpwMDw
	 * The first rucksack contains the items vJrwpWtwJgWrhcsFMMfFFhFp, which means its first compartment contains the items vJrwpWtwJgWr, while the second compartment contains the items hcsFMMfFFhFp. The only item type that appears in both compartments is lowercase p.
	 * The second rucksack's compartments contain jqHRNqRjqzjGDLGL and rsFMfFZSrLrFZsSL. The only item type that appears in both compartments is uppercase L.
	 * The third rucksack's compartments contain PmmdzqPrV and vPwwTWBwg; the only common item type is uppercase P.
	 * The fourth rucksack's compartments only share item type v.
	 * The fifth rucksack's compartments only share item type t.
	 * The sixth rucksack's compartments only share item type s.
	 * To help prioritize item rearrangement, every item type can be converted to a priority:
	 *
	 * Lowercase item types a through z have priorities 1 through 26.
	 * Uppercase item types A through Z have priorities 27 through 52.
	 * In the above example, the priority of the item type that appears in both compartments of each rucksack is 16 (p), 38 (L), 42 (P), 22 (v), 20 (t), and 19 (s); the sum of these is 157.
	 *
	 * Find the item type that appears in both compartments of each rucksack. What is the sum of the priorities of those item types?
	 */
	total_priorities_of_item() {
		const rucksacks = parseListString(__dirname + "/DAY_3_INPUTS");
		const result = rucksacks.reduce((total, rucksack) => {
			const firstRucksack = rucksack.slice(0, rucksack.length / 2);
			const secondRucksack = rucksack.slice(rucksack.length / 2);
			assert(secondRucksack.length === firstRucksack.length, "Not same length");
			const sameItem = this.findSameItem(firstRucksack, secondRucksack);
			total += this.getPriorityValue(sameItem);
			return total;
		}, 0);
		console.log("DAY 3 => total priorities of item", result);
	}

	/**
	 * As you finish identifying the misplaced items, the Elves come to you with another issue.
	 *
	 * For safety, the Elves are divided into groups of three. Every Elf carries a badge that identifies their group. For efficiency, within each group of three Elves, the badge is the only item type carried by all three Elves. That is, if a group's badge is item type B, then all three Elves will have item type B somewhere in their rucksack, and at most two of the Elves will be carrying any other item type.
	 *
	 * The problem is that someone forgot to put this year's updated authenticity sticker on the badges. All of the badges need to be pulled out of the rucksacks so the new authenticity stickers can be attached.
	 *
	 * Additionally, nobody wrote down which item type corresponds to each group's badges. The only way to tell which item type is the right one is by finding the one item type that is common between all three Elves in each group.
	 *
	 * Every set of three lines in your list corresponds to a single group, but each group can have a different badge item type. So, in the above example, the first group's rucksacks are the first three lines:
	 *
	 * vJrwpWtwJgWrhcsFMMfFFhFp
	 * jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
	 * PmmdzqPrVvPwwTWBwg
	 * And the second group's rucksacks are the next three lines:
	 *
	 * wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
	 * ttgJtRGJQctTZtZT
	 * CrZsJsPPZsGzwwsLwLmpwMDw
	 * In the first group, the only item type that appears in all three rucksacks is lowercase r; this must be their badges. In the second group, their badge item type must be Z.
	 *
	 * Priorities for these items must still be found to organize the sticker attachment efforts: here, they are 18 (r) for the first group and 52 (Z) for the second group. The sum of these is 70.
	 *
	 * Find the item type that corresponds to the badges of each three-Elf group. What is the sum of the priorities of those item types?
	 */
	total_priorities_for_a_group_of_bag() {
		const rucksacks = parseListString(__dirname + "/DAY_3_INPUTS");
		let result = 0;
		for (let index = 0; index < rucksacks.length; index = index + 3) {
			const bags = [];
			bags.push(rucksacks[index]);
			bags.push(rucksacks[index + 1]);
			bags.push(rucksacks[index + 2]);
			console.assert(!bags.includes(undefined));

			const commonItem = this.getCommonItem(bags);
			result += this.getPriorityValue(commonItem);
		}

		console.log("DAY 3 => total priorities for a group of bag", result);
	}

	findSameItem(firstRucksack: string, secondRucksack: string): string {
		const mapOfItems = new Map();
		let sameItem = "";
		firstRucksack.split("").forEach((item) => mapOfItems.set(item, 1));
		for (let item of secondRucksack.split("")) {
			if (mapOfItems.has(item) && mapOfItems.get(item) === 1) {
				sameItem = item;
				break;
			} else {
				mapOfItems.set(item, 2);
			}
		}
		return sameItem;
	}

	getPriorityValue(item: string): number {
		if (item === item.toLowerCase()) {
			return item.charCodeAt(0) - 96;
		} else {
			return item.charCodeAt(0) - 64 + 26;
		}
	}

	getCommonItem(bags: Array<string>): string {
		const items = new Map<string, { [id: string]: boolean }>();
		const COUNT_IN_ALL_BAGS = bags.length;

		for (let index = 0; index < bags.length; index++) {
			const bag = bags[index];
			for (let item of bag) {
				if (items.has(item)) {
					let currentItem = items.get(item);
					currentItem[bag] = true;
					items.set(item, currentItem);
				} else {
					const newItem = {};
					newItem[bag] = true;
					items.set(item, newItem);
				}

				if (
					items.has(item) &&
					Object.values(items.get(item)).length === COUNT_IN_ALL_BAGS
				) {
					// common item of the x bags
					return item;
				}
			}
		}
		return undefined;
	}
}
