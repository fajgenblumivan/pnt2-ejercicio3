new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },

        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true
            this.saludJugador = 100
            this.saludMonstruo = 100
            this.turnos = []
        },

        atacar: function () {
            let daño = this.calcularHeridas(this.rangoAtaque[0],this.rangoAtaque[1]);
            this.saludMonstruo -= daño
            if( this.saludMonstruo < 0 ){ this.saludMonstruo = 0}

            this.registrarEvento({
                esJugador : true,
                info : `El ataque del jugador es de ${daño}`
            })

            if( !this.verificarGanador() ){
                this.ataqueDelMonstruo()
            }
        },

        ataqueEspecial: function () {
            let daño = this.calcularHeridas(this.rangoAtaqueEspecial[0],this.rangoAtaqueEspecial[1])
            this.saludMonstruo -= daño
            if( this.saludMonstruo < 0 ){ this.saludMonstruo = 0}

            this.registrarEvento({
                esJugador : true,
                info : `El ataque especial del jugador es de ${daño}`
            })

            if( !this.verificarGanador() ){
                this.ataqueDelMonstruo()
            }

        },

        curar: function () {
            if(this.saludJugador <= 90){
                this.saludJugador += 10 
            }

            this.registrarEvento({
                esJugador : true,
                info : `El jugador se curo`
            })

            this.ataqueDelMonstruo()
        },

        registrarEvento(evento) {
            this.turnos.unshift(evento) 
        },

        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false
        },

        ataqueDelMonstruo: function () {
            let daño = this.calcularHeridas(this.rangoAtaqueDelMonstruo[0],this.rangoAtaqueDelMonstruo[1]);
            this.saludJugador -= daño
            if( this.saludJugador < 0 ){ this.saludJugador = 0}
            
            this.registrarEvento({
                esJugador : false,
                info : `El ataque del monstruo es de ${daño}`
            })

            this.verificarGanador()
        },

        calcularHeridas: function (min,max) {
            let ataque = Math.max(Math.floor(Math.random()*max)+1 ,min)
            return ataque
        },

        verificarGanador: function () {
            let ganaste = false
            if(this.saludMonstruo <= 0){
                this.terminarPartida()
                ganaste = true

                this.registrarEvento({
                    esJugador : true,
                    info : `Gano el jugador`
                })
            } else if(this.saludJugador <= 0){
                this.terminarPartida()
                ganaste = true
                this.registrarEvento({
                    esJugador : false,
                    info : `Gano el monstruo`
                })
            }
            return ganaste
        },

        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});