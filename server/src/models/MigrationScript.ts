import mongoose from 'mongoose'

const migrationScriptSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export type MigrationScriptType = mongoose.HydratedDocument<mongoose.InferSchemaType<typeof migrationScriptSchema>>

export default mongoose.model<MigrationScriptType>('MigrationScript', migrationScriptSchema, 'migration_scripts')