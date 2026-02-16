import * as github from "@api/services/requests/github/index"
import * as links from "@api/services/requests/links/index"
import * as npm from "@api/services/requests/npm/index"

export const ApiClient = {
  links,
  github,
  npm
}

export default ApiClient
