class Game {
    constructor() {
        this.money = 1000;
        this.moneyTimer = 0;
        this.moneyGenerationRate = 50; // Money per frame
        this.moneyGenerationInterval = 60; // Generate money every 60 frames (about 1 second)
        this.units = [];
        this.enemySpawnTimer = 0;
        this.leftTowerHealth = 20000;
        this.rightTowerHealth = 20000;
        
        // Unit definitions
        this.unitTypes = {
            basicCat: { cost: 100, health: 150, damage: 20, speed: 0.9, name: "Basic Cat" },
            tankCat: { cost: 250, health: 350, damage: 15, speed: 0.5, name: "Tank Cat" },
            ninjaCat: { cost: 400, health: 150, damage: 40, speed: 1.5, name: "Ninja Cat" },
            flyingCat: { cost: 300, health: 200, damage: 25, speed: 1, name: "Flying Cat" },
            magicCat: { cost: 500, health: 250, damage: 35, speed: 0.9, name: "Magic Cat" },
            
            // Enemy units with reduced speed
            trump: { health: 200, damage: 30, speed: 0.8, name: "Trump" },
            desantis: { health: 200, damage: 25, speed: 0.9, name: "DeSantis" },
            cruz: { health: 200, damage: 20, speed: 1, name: "Cruz" },
            mtg: { health: 200, damage: 28, speed: 0.7, name: "MTG" }
        };

        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }

    deployUnit(type) {
        const unitData = this.unitTypes[type];
        if (this.money >= unitData.cost) {
            this.money -= unitData.cost;
            const unit = {
                type: type,
                x: 120,
                y: 300, // Fixed y position above the floor
                health: unitData.health,
                maxHealth: unitData.health, // Add maxHealth for health bar
                damage: unitData.damage,
                speed: unitData.speed,
                isEnemy: false
            };
            this.units.push(unit);
            this.createUnitElement(unit);
            this.updateMoneyDisplay();
        }
    }

    spawnEnemy() {
        const enemyTypes = ['trump', 'desantis', 'cruz', 'mtg'];
        const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const unitData = this.unitTypes[randomType];
        
        const unit = {
            type: randomType,
            x: 680,
            y: 300, // Fixed y position above the floor
            health: unitData.health,
            maxHealth: unitData.health, // Add maxHealth for health bar
            damage: unitData.damage,
            speed: unitData.speed,
            isEnemy: true
        };
        this.units.push(unit);
        this.createUnitElement(unit);
    }

    createUnitElement(unit) {
        const element = document.createElement('div');
        element.className = `unit ${unit.isEnemy ? 'enemy' : ''}`;
        element.style.left = unit.x + 'px';
        element.style.top = unit.y + 'px';
        element.style.backgroundColor = unit.isEnemy ? 'red' : 'blue';

        // Add health bar
        const healthBar = document.createElement('div');
        healthBar.className = 'health-bar';
        element.appendChild(healthBar);

        document.getElementById('gameContainer').appendChild(element);
        unit.element = element;
        unit.healthBar = healthBar;
    }

    updateMoneyDisplay() {
        document.getElementById('moneyDisplay').textContent = `Money: ${this.money}`;
    }

    updateHealthBars() {
        this.units.forEach(unit => {
            const healthPercent = (unit.health / unit.maxHealth) * 100;
            unit.healthBar.style.width = `${healthPercent}%`;
        });

        // Update tower health numbers
        document.getElementById('leftTowerHealth').textContent = `HP: ${this.leftTowerHealth}`;
        document.getElementById('rightTowerHealth').textContent = `HP: ${this.rightTowerHealth}`;
    }

    gameLoop() {
        // Generate money over time
        this.moneyTimer++;
        if (this.moneyTimer >= this.moneyGenerationInterval) {
            this.money += this.moneyGenerationRate;
            this.updateMoneyDisplay();
            this.moneyTimer = 0;
        }

        // Spawn enemies
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer >= 120) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }

        // Update units
        this.units.forEach(unit => {
            if (unit.isEnemy) {
                unit.x -= unit.speed;
            } else {
                unit.x += unit.speed;
            }
            unit.element.style.left = unit.x + 'px';
        });

        // Check collisions and combat
        this.checkCollisions();

        // Remove dead units
        this.units = this.units.filter(unit => {
            if (unit.health <= 0) {
                unit.element.remove();
                if (!unit.isEnemy) {
                    this.money += 50; // Reward for defeated enemy
                    this.updateMoneyDisplay();
                }
                return false;
            }
            return true;
        });

        // Check tower damage
        this.units.forEach(unit => {
            if (unit.isEnemy && unit.x <= 100) {
                this.leftTowerHealth -= unit.damage;
                unit.element.remove();
                if (this.leftTowerHealth <= 0) {
                    alert("Game Over! Republicans Win :(");
                    location.reload();
                }
            } else if (!unit.isEnemy && unit.x >= 700) {
                this.rightTowerHealth -= unit.damage;
                unit.element.remove();
                if (this.rightTowerHealth <= 0) {
                    alert("Victory! Cats Win! :3 :3 :3");
                    location.reload();
                }
            }
        });

        // Update health bars
        this.updateHealthBars();

        requestAnimationFrame(this.gameLoop);
    }

    checkCollisions() {
        for (let i = 0; i < this.units.length; i++) {
            for (let j = i + 1; j < this.units.length; j++) {
                const unit1 = this.units[i];
                const unit2 = this.units[j];
                
                if (unit1.isEnemy !== unit2.isEnemy) {
                    const dx = Math.abs(unit1.x - unit2.x);
                    const dy = Math.abs(unit1.y - unit2.y);
                    
                    if (dx < 50 && dy < 50) {
                        unit1.health -= unit2.damage;
                        unit2.health -= unit1.damage;
                    }
                }
            }
        }
    }
}

const game = new Game(); 