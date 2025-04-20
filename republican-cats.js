class Character {
    constructor(name, cost, health, damage, attackSpeed) {
        this.name = name;
        this.cost = cost;
        this.health = health;
        this.damage = damage;
        this.attackSpeed = attackSpeed;
        this.position = 0;
        this.isDeployed = false;
    }

    attack(enemy) {
        return this.damage;
    }
}

class RepublicanUnit extends Character {
    constructor(name, cost, health, damage, attackSpeed, specialAbility) {
        super(name, cost, health, damage, attackSpeed);
        this.specialAbility = specialAbility;
    }
}

// Define Republican "cats"
const republicans = {
    trump: new RepublicanUnit(
        "Donald Trump",
        500,
        1000,
        150,
        1.5,
        "Wall Builder: Creates temporary barrier"
    ),
    desantis: new RepublicanUnit(
        "Ron DeSantis",
        400,
        800,
        100,
        2,
        "Florida Man: Summons chaos"
    ),
    mtg: new RepublicanUnit(
        "Marjorie Taylor Greene",
        300,
        600,
        120,
        1.8,
        "Conspiracy Theory: Confuses enemies"
    ),
    cruz: new RepublicanUnit(
        "Ted Cruz",
        350,
        700,
        90,
        1.7,
        "Cancun Escape: Temporary invincibility"
    )
};

class Game {
    constructor() {
        this.money = 1000;
        this.deployedUnits = [];
        this.enemies = [];
        this.baseHealth = 2000;
    }

    deployUnit(republicanName) {
        const unit = republicans[republicanName];
        if (unit && this.money >= unit.cost) {
            this.money -= unit.cost;
            this.deployedUnits.push({...unit});
            console.log(`Deployed ${unit.name}!`);
        } else {
            console.log("Not enough money or invalid unit!");
        }
    }

    generateMoney() {
        this.money += 10;
    }

    update() {
        // Update game state
        this.generateMoney();
        
        // Update units
        this.deployedUnits.forEach(unit => {
            unit.position += 1;
            // Add battle logic here
        });

        console.log(`Current money: ${this.money}`);
    }
}

// Example usage
const game = new Game();

// Game loop example
function gameLoop() {
    game.update();
    // Deploy Trump when enough money
    if (game.money >= republicans.trump.cost) {
        game.deployUnit('trump');
    }
}

// Run game loop every second
setInterval(gameLoop, 1000); 