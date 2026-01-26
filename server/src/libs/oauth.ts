import * as arctic from 'arctic'
import env from '../config/env'

export const google = new arctic.Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_REDIRECT_URI)

export const github = new arctic.GitHub(env.GITHUB_CLIENT_ID,env.GITHUB_CLIENT_SECRET,env.GITHUB_REDIRECT_URI)