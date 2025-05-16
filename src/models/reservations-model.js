const { query, getClient } = require("../database");
const HttpError = require("../errors/http-error");
const reservationSchema = require("../validations/reservations-schema");

class Reservation {
  constructor(reservationRow) {
    this.id = reservationRow.id;
    this.userId = reservationRow.user_id;
    this.spaceId = reservationRow.space_id;
    this.startTime = new Date(reservationRow.start_time);
    this.endTime = new Date(reservationRow.end_time);
    this.createdAt = new Date(reservationRow.created_at);
    this.updatedAt = new Date(reservationRow.updated_at);
  }

  static async getAll() {
    const reservationsResult = await query(
      `
      SELECT * 
      FROM reservations;
      `
    );

    return reservationsResult.rows.map(
      (reservation) => new Reservation(reservation)
    );
  }

  static async getById(reservationId) {
    const reservationResult = await query(
      `
      SELECT *
      FROM reservations
      WHERE id = $1
      `,
      [reservationId]
    );

    if (!reservationResult.rows[0])
      throw new HttpError(404, "Reservation not found.");

    return new Reservation(reservationResult.rows[0]);
  }

  static async create({ userId, spaceId, startTime, endTime }) {
    const isReservationsCredentialsValid = reservationSchema.validate({
      userId,
      spaceId,
      startTime,
      endTime,
    });

    if (isReservationsCredentialsValid.error)
      throw new HttpError(400, "Invalid credentials.");

    const dbClient = await getClient();

    try {
      await dbClient.query("BEGIN");

      // Verificar conflitos de horário
      const conflictCheck = await dbClient.query(
        `
        SELECT *
        FROM reservations
        WHERE
          space_id = $1
          AND
          (start_time < $2 AND end_time > $3);
        `,
        [spaceId, startTime, endTime]
      );

      if (conflictCheck.rows[0])
        throw new HttpError(400, "Time already reserverd for this space.");

      // Criar reserva
      const reservationResult = await dbClient(
        `
        INSERT INTO reservations (user_id, space_id, start_time, end_time)
        VALUES ($1, $2, $3, $4)
        `,
        [userId, spaceId, startTime, endTime]
      );

      await dbClient.query("COMMIT");

      return { message: "Reservation created successfully." };
    } catch (error) {
      await dbClient.query("ROLLBACK");

      throw new HttpError(error.status, error.message);
    } finally {
      dbClient.release();
    }
  }
}

module.exports = Reservation;
