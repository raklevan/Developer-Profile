
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const axios = require("axios");
require("dotenv").config();
const open = require("open");
const pdf = require("html-pdf");

const generateHTML = require("./generateHTML");


const questions = [
    {
        type: "input",
        name: "username",
        message: "What is your GitHub username?"
    },

    {
        type: "list",
        name: "color",
        message: "Choose a color",
        choices: ["blue", "green", "pink", "red"]

    }
];


async function init() {

    const userOptions = await inquirer.prompt(questions);


    const gitHubData = await getProfileData(userOptions.username);

    const reposData = await getReposData(userOptions.username);

    const stars = await starCount(reposData);

    const data = await {
        color: userOptions.color,
        image: gitHubData.data.avatar_url,
        name: gitHubData.data.name,
        location: gitHubData.data.location,
        githubURL: gitHubData.data.html_url,
        bio: gitHubData.data.bio,
        publicRepos: gitHubData.data.public_repos,
        followers: gitHubData.data.followers,
        following: gitHubData.data.following,
        stars: stars,
    }

    const html = await generateHTML(data);

    console.log(data)

    generatePDF(html);

}

function generatePDF(html) {

    var options = { format: 'Letter' };

    pdf.create(html, options).toFile('./profile.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res);
    });

}


function getProfileData(username) {
    return axios.get(`https://api.github.com/users/${username}?client_id=$%7Bprocess.env.CLIENT_ID%7D&client_secret=$%7Bprocess.env.CLIENT_SECRET%7D`)

}


function getReposData(username) {
    return axios.get(`https://api.github.com/users/${username}/repos?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&per_page=100`);
}


function starCount(repositories) {

    let stars = 0;

    repositories.data.forEach(repo => {

        stars += repo.stargazers_count;

    }
    )
    return stars;
}

init();










