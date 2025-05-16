const { query } = require("../database")
const HttpError = require("../errors/http-error")

class Reservation {
  constructor(reservationRow) {
    this.id = reservationRow.id
    this.userId = reservationRow.user_id
    this.spaceId = reservationRow.space_id
    this.startTime = reservationRow.start_time
    this.endTime = reservationRow.end_time
    this.createdAt = reservationRow.created_at
    this.updatedAt = reservationRow.updated_at
  }

  static async getAll() {
    const reservationsResult = await query(
      `
      SELECT * 
      FROM reservations;
      `
    )

    return reservationsResult.rows.map(reservation => new Reservation(reservation))
  }

  static async getById(reservationId) {
    const reservationResult = await query(
      `
      SELECT *
      FROM reservations
      WHERE id = $1
      `,
      [reservationId]
    )

    if(!reservationResult.rows[0]) throw new HttpError(404, 'Reservation not found.')

    return new Reservation(reservationResult.rows[0])
  }

  static async create({userId, spaceId, startTime, endTime}) {
    
  }
}

module.exports = Reservation