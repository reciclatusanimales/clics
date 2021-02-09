module.exports = {
	purge: ["./src/**/*.tsx"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		fontFamily: {
			body: ["IBM Plex Sans"],
		},
		extend: {
			colors: {
				blue: {
					100: "#cce4f6",
					200: "#99c9ed",
					300: "#66afe5",
					400: "#3394dc",
					500: "#0079d3",
					600: "#0061a9",
					700: "#00497f",
					800: "#003054",
					900: "#00182a",
				},
				primary: {
					1: "#457B9D",
					2: "#A8DADC",
					3: "#1D3557",
					4: "#E63946",
					5: "#F1FAEE",
				},
				secondary: {
					1: "#FBFBF2",
					2: "#E5E6E4",
					3: "#CFD2CD",
					4: "#A6A2A2",
					5: "#847577",
				},
				dark: {
					1: "#212529",
					2: "#343A40",
					3: "#495057",
					4: "#6C757D",
					5: "#ADB5BD",
					6: "#CED4DA",
					7: "#DEE2E6",
					8: "#E9ECEF",
					9: "#F8F9FA",
				},
			},
			spacing: {
				70: "17.5rem",
				160: "40rem",
			},
			container: false,
		},
	},
	variants: {
		extend: {
			backgroundColor: ["disabled"],
			borderColor: ["disabled"],
		},
	},
	plugins: [
		function ({ addComponents }) {
			addComponents({
				".container": {
					width: "100%",
					marginLeft: "auto",
					marginRight: "auto",
					"@screen sm": { maxWidth: "640px" },
					"@screen md": { maxWidth: "768px" },
					"@screen lg": { maxWidth: "975px" },
				},
			});
		},
	],
};
