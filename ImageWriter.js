const { createCanvas, loadImage } = require('canvas')

const SKILL_HEADERS = ["Rank", "Name", "Level", "XP"]
const KC_HEADERS = ["Rank", "Name", "Score"]

// This file uses a lot of magic numbers that work with the current layout
// There is probably some math to figure these out but this works so it stays

// Text Paddings
const TOP_PADDING = 16
const LEFT_PADDING = 18
const RANK_PADDING = 50
const USERNAME_PADDING = 118
const LEVEL_PADDING = 64
const KC_PADDING = 50
const SPACER = 6
const MAX_ROWS = 25
const EXTRA_ROWS = 3

class ImageWriter {
	headerImage = {}
	middleImage = {}
	bottomImage = {}

	constructor() {
		Promise.all([
			loadImage('./image-templates/scroll-top.png'),
			loadImage('./image-templates/scroll-middle.png'),
			loadImage('./image-templates/scroll-bottom.png'),
		]).then((images) => {
			this.headerImage = images[0]
			this.middleImage = images[1]
			this.bottomImage = images[2]
		})
	}
	
	addMiddleSection = function(image, fields, x, y) {
		image.drawImage(this.middleImage, x, y, this.middleImage.width, this.middleImage.height)
		const hasExperience = fields.length >= 4;

		y+= TOP_PADDING
		x+= hasExperience ? LEFT_PADDING : KC_PADDING

		// rank number
		x+= RANK_PADDING
		image.textAlign = "right"
		image.fillText(fields[0], x, y)
		x+= SPACER
		// username
		image.textAlign = "left"
		image.fillText(fields[1], x, y)
		// 13th w is just for some extra spacing
		x+= USERNAME_PADDING + (hasExperience ? 0 : KC_PADDING)
		image.textAlign = hasExperience ? "left" : "right"
		// Level
		image.fillText(fields[2], x, y)
		x+= LEVEL_PADDING
		image.textAlign = "left"

		// Experience (if applicable)
		if (hasExperience) {
			image.textAlign = "right"
			image.fillText(fields[3], this.middleImage.width - LEFT_PADDING, y)
			image.textAlign = "left"
		}

		return image
	}

	generateHiscoreImage = (hiscoreData, endpoint, category) => {
		const elements = Math.min(MAX_ROWS, hiscoreData.length)
		if (elements <= 0) {
			return null
		}

		const imageWidth = Math.max(this.headerImage.width, Math.max(this.bottomImage.width, this.middleImage.width))
		const imageHeight = this.headerImage.height + this.bottomImage.height + (this.middleImage.height * (elements + EXTRA_ROWS))
		const centerPoint = imageWidth / 2

		let curHeight = this.headerImage.height

		// Draw the header image
		let outputCanvas = createCanvas(imageWidth, imageHeight)
		let outputImage = outputCanvas.getContext('2d')
		outputImage.drawImage(this.headerImage, 0, 0, this.headerImage.width, this.headerImage.height)

		// Add branding text
		outputImage.drawImage(this.middleImage, 0, curHeight, this.middleImage.width, this.middleImage.height)
		outputImage.font = "bold 20px Arial"
		outputImage.textAlign = "center"
		outputImage.fillText("IronScape Rankings", centerPoint, curHeight + TOP_PADDING)
		curHeight += this.middleImage.height

		// Add Category text
		outputImage.drawImage(this.middleImage, 0, curHeight, this.middleImage.width, this.middleImage.height)
		outputImage.font = "bold 18px Arial"
		const endpointText = endpoint.substring(0, 1) + endpoint.substring(1).toLowerCase().replace("_", " ")
		const categoryText = `${category} (${endpointText})`;
		outputImage.fillText(categoryText, centerPoint, curHeight + TOP_PADDING)
		outputImage.textAlign = "left"
		curHeight += this.middleImage.height

		// Add Hiscore headers
		outputImage.font = "bold 16px Arial"
		outputImage.drawImage(this.middleImage, 0, curHeight, this.middleImage.width, this.middleImage.height)

		const hasSkillHeaders = hiscoreData[0][endpoint][category].exp !== -1
		const headers = hasSkillHeaders ? SKILL_HEADERS : KC_HEADERS
		this.addMiddleSection(outputImage, headers, 0, curHeight)
		curHeight += this.middleImage.height
		outputImage.font = "16px Arial"

		// Add each hiscore entry now
		for (let i = 0; i < elements; i++) {
			const element = hiscoreData[i][endpoint]
			const hiscoreResult = element[category]
			let fields = [hiscoreResult.rank.toLocaleString('en') + ")", element.username, String(hiscoreResult.level)]
			if (hiscoreResult.exp > -1) {
				fields.push(hiscoreResult.exp.toLocaleString('en'))
			}
			outputImage = this.addMiddleSection(outputImage, fields, 0, curHeight)
			curHeight += this.middleImage.height
		}

		outputImage.drawImage(this.bottomImage, 0, curHeight, this.bottomImage.width, this.bottomImage.height)
		return outputCanvas.toBuffer()
	}
}

module.exports = new ImageWriter()
