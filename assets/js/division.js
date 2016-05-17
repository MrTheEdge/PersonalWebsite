var divisionApp = angular.module('divisionDpsApp', []);

divisionApp.service('Util', function(){
  return {
    rps : function(rpm){ // Simple conversion from rpm to rps
      return rpm / 60;
    },
    // One is none gives 50% chance to refund bullet with headshot
    modifiedMagSize : function(magSize, hsChance, oin){
      if (!oin) return magSize;
      var chance = hsChance === '' ? 1 : hsChance / 100; // If no hs chance, assume 100%
      var extra = (magSize * chance) * 0.5; // 50% of headshots returned
      var modMagSize = magSize + extra;
      while (extra > 1){ // Loop until less than one bullet extra
        extra = (extra * chance) * 0.5;
        modMagSize += extra;
      }
      return modMagSize;
    },
    crits : function(numBullets, critChance){ // Number of crits based on chance
      return numBullets * (critChance / 100);
    },
    hsPerMag : function(magSize, hsChance){ // Assume 100% hs rate if empty
      var chance = hsChance === '' ? 100 : hsChance;
      return this.crits(magSize, chance);
    },
    critDamage : function(baseDamage, critDamage){ // Bonus damage from percent
      return baseDamage * ((critDamage / 100) + 1)
    },
    hsDamage : function(baseDamage, hsDamage){
      return this.critDamage(baseDamage, hsDamage);
    }
  };
});

divisionApp.service('Stats', function(Util){
  return {
    baseStats : { // Core stats from form.
      damage : '',
      rpm : '',
      magSize : '',
      reload : '',
      critChance : '',
      critDamage : '',
      hsChance : '',
      hsDamage : '',
      oneIsNone : false
    },
    computedStats : { // Calculated stats to display
      sustDps : '-',
      burstDps : '-',
      sustDpsSkills : '-',
      burstDpsSkills : '-',
      adjMagSize : ''
    },
    compute : function(){
      var stdHits, critHits, hsHits, hsCritHits;
      var stdDamage, critDamage, hsDamage, hsCritDamage;
      var totalDamagePerMag;
      this.computedStats.adjMagSize = Util.modifiedMagSize(this.baseStats.magSize, this.baseStats.hsChance, this.baseStats.oneIsNone);
      hsHits = Util.hsPerMag(this.computedStats.adjMagSize, this.baseStats.hsChance);
      stdHits = this.computedStats.adjMagSize - hsHits;
      // Work out crits for each type of hit (hs vs standard)
      critHits = Util.crits(stdHits, this.baseStats.critChance);
      stdHits -= critHits;
      hsCritHits = Util.crits(hsHits, this.baseStats.critChance);
      hsHits -= hsCritHits;

      //console.log("Std Hits: ", stdHits, " HS Hits: ", hsHits);
      //console.log("Crit Hits: ", critHits, " HS Crits: ", hsCritHits);

      stdDamage = this.baseStats.damage;
      hsDamage = Util.hsDamage(stdDamage, this.baseStats.hsDamage);
      critDamage = Util.critDamage(stdDamage, this.baseStats.critDamage);
      hsCritDamage = Util.critDamage(hsDamage, this.baseStats.critDamage);
      totalDamagePerMag = (stdDamage * stdHits) + (hsDamage * hsHits) + (critDamage * critHits) + (hsCritDamage * hsCritHits);

      //console.log("Std Damage: ", stdDamage, " HS Damage: ", hsDamage);
      //console.log("Crit Damage: ", critDamage, " HS Crit Damage: ", hsCritDamage);
      //console.log("Total Damage Per Mag: ", totalDamagePerMag);

      var cycleTime = this.computedStats.adjMagSize / Util.rps(this.baseStats.rpm);
      var sustCycleTime = cycleTime + this.baseStats.reload;

      //console.log("Cycle Time: ", cycleTime);
      //console.log("Sust. Cycle Time: ", sustCycleTime);

      this.computedStats.sustDps = Math.round(totalDamagePerMag / sustCycleTime).toLocaleString();
      this.computedStats.burstDps = Math.round(totalDamagePerMag / cycleTime).toLocaleString();

    }
  };
});

divisionApp.controller('inputCtrl', function($scope, Stats){
  $scope.stats = Stats.baseStats;

  $scope.update = function(){
    Stats.compute();
  };
});

divisionApp.controller('resultCtrl', function($scope, Stats){
  $scope.stats = Stats.computedStats;
});
