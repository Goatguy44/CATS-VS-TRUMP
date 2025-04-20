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
        this.gameActive = true;
        
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
        this.checkOrientation = this.checkOrientation.bind(this);
        
        // Add orientation change listener
        window.addEventListener('orientationchange', this.checkOrientation);
        window.addEventListener('resize', this.checkOrientation);
        this.checkOrientation();

        requestAnimationFrame(this.gameLoop);
    }

    checkOrientation() {
        const orientationWarning = document.getElementById('orientationWarning');
        if (window.innerHeight > window.innerWidth) {
            orientationWarning.style.display = 'flex';
            this.pauseGame();
        } else {
            orientationWarning.style.display = 'none';
            this.resumeGame();
        }
    }

    pauseGame() {
        this.gameActive = false;
    }

    resumeGame() {
        this.gameActive = true;
        requestAnimationFrame(this.gameLoop);
    }

    showGameOver(victory) {
        const gameOverScreen = document.getElementById('gameOverScreen');
        const gameOverTitle = document.getElementById('gameOverTitle');
        const gameOverMessage = document.getElementById('gameOverMessage');

        if (victory) {
            gameOverTitle.textContent = '🎉 Victory! 🐱';
            gameOverMessage.textContent = 'The cats have triumphed! Democracy is safe!';
        } else {
            gameOverTitle.textContent = '😿 Defeat';
            gameOverMessage.textContent = 'The Republicans have won... but the resistance continues!';
        }

        gameOverScreen.style.display = 'flex';
        this.gameActive = false;
    }

    restartGame() {
        // Clear all units
        this.units.forEach(unit => {
            if (unit.element) {
                unit.element.remove();
            }
        });
        this.units = [];

        // Reset game state
        this.money = 1000;
        this.moneyTimer = 0;
        this.enemySpawnTimer = 0;
        this.leftTowerHealth = 20000;
        this.rightTowerHealth = 20000;
        this.gameActive = true;

        // Hide game over screen
        document.getElementById('gameOverScreen').style.display = 'none';

        // Update displays
        this.updateMoneyDisplay();
        this.updateHealthBars();

        // Restart game loop
        requestAnimationFrame(this.gameLoop);
    }

    deployUnit(type) {
        const unitData = this.unitTypes[type];
        if (this.money >= unitData.cost) {
            this.money -= unitData.cost;
            const gameContainer = document.getElementById('gameContainer');
            const containerHeight = gameContainer.offsetHeight;
            const yPosition = containerHeight * 0.75; // Position at 75% of container height
            
            const unit = {
                type: type,
                x: 120,
                y: yPosition,
                health: unitData.health,
                maxHealth: unitData.health,
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
        const gameContainer = document.getElementById('gameContainer');
        const containerHeight = gameContainer.offsetHeight;
        const yPosition = containerHeight * 0.75; // Position at 75% of container height
        
        const unit = {
            type: randomType,
            x: 680,
            y: yPosition,
            health: unitData.health,
            maxHealth: unitData.health,
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
        if (!this.gameActive) return;

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
                    this.showGameOver(false);
                    return;
                }
            } else if (!unit.isEnemy && unit.x >= 700) {
                this.rightTowerHealth -= unit.damage;
                unit.element.remove();
                if (this.rightTowerHealth <= 0) {
                    this.showGameOver(true);
                    return;
                }
            }
        });

        // Update health bars
        this.updateHealthBars();

        if (this.gameActive) {
            requestAnimationFrame(this.gameLoop);
        }
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