const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Математика" },
                { name: "Англійська мова" },
                { name: "Фізика" },
                { name: "Українська мова" },
                { name: "Українська література" },
                { name: "Хімія" },
                { name: "Географія" },
                { name: "Біологія" },
                { name: "Історія України" },
            ]
        });
        await database.questionType.createMany({
            data: [
                {id: "SINGLECHOICE", name: "SINGLECHOICE"},
                {id: "MULTICHOICE", name: "MULTICHOICE"},
                {id: "INPUT", name: "INPUT"},
                {id: "MATCHING", name: "MATCHING"},
            ]
        })
        console.log("Success");
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        await database.$disconnect();
    }
}

main();