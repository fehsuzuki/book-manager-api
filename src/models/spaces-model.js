const { query } = require("../database");
const HttpError = require("../errors/http-error");

class Space {
  constructor(spaceRow) {
    this.id = spaceRow.id;
    this.name = spaceRow.name;
    this.description = spaceRow.description;
    this.capacity = spaceRow.capacity;
    this.location = spaceRow.location;
    this.createdAt = new Date(spaceRow.created_at);
    this.updatedAt = new Date(spaceRow.updated_at);
  }

  static async getAll() {
    const spacesResult = await query(
      `
      SELECT * 
      FROM spaces;
      `
    );

    return spacesResult.rows.map((space) => new Space(space));
  }

  static async getById(spaceId) {
    const spaceResult = await query(
      `
      SELECT *
      FROM spaces
      WHERE id = $1
      `,
      [spaceId]
    );

    if (!spaceResult.rows[0]) throw new HttpError(404, "Space not found.");

    return new Space(spaceResult.rows[0]);
  }

  static async create({ name, description, capacity, location }) {
    const spaceResult = await query(
      `
      SELECT * 
      FROM spaces
      WHERE name = $1 AND location = $2;
      `,
      [name, location]
    );

    if (spaceResult.rows[0]) throw new HttpError(400, "Space already exists.");

    const newSpaceResult = await query(
      `
      INSERT INTO spaces (name, description, capacity, location)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, description, capacity, location]
    );

    return new Space(newSpaceResult.rows[0]);
  }

  static async update(spaceId, { name, description, capacity, location }) {

    const spaceResult = await query(
      `
      SELECT *
      FROM spaces
      WHERE id = $1
      `,
      [spaceId]
    );

    if (!spaceResult.rows[0]) throw new HttpError(404, "Space not found.");

    const spaceData = spaceResult.rows[0]

    if(name === undefined) name = spaceData.name
    if(description === undefined) description = spaceData.description
    if(capacity === undefined) capacity = spaceData.capacity
    if(location === undefined) location = spaceData.location

    const updatedAt = new Date()

    // Verificando se já existe um espaço registrado com o mesmo nome e mesmo endereço
    const spaceExistsResult = await query(
      `
      SELECT *
      FROM spaces
      WHERE name = $1 AND location = $2;
      `,
      [name, location]
    )

    if(name !== spaceData.name && location !== spaceData.location) throw new HttpError(400, 'Space already registered.')

    const updatedSpaceResult = await query(
      `
      UPDATE spaces
      SET
        name = $1,
        description = $2,
        capacity = $3,
        location = $4,
        updated_at = $5
      WHERE id = $6
      RETURNING*;
      `,
      [name, description, capacity, location, updatedAt, spaceId]
    )

    return new Space(updatedSpaceResult.rows[0])
  }

  static async delete(spaceId) {
    const spaceResult = await query(
      `
      SELECT * 
      FROM spaces
      WHERE id = $1
      `,
      [spaceId]
    )

    if(!spaceResult) throw new HttpError(404, 'Space not found.')

    await query(
      `
      DELETE FROM spaces
      WHERE id = $1
      `,
      [spaceId]
    )
  }
}

module.exports = Space;
