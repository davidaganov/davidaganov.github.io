import { render, screen } from "@testing-library/react"
import { Navbar } from "./Navbar"

const data = [
  { link: "#test", title: "Test" },
  { link: "#link", title: "Link" }
]

describe("Navbar component", () => {
  it("Navbar renders", () => {
    render(<Navbar list={data} />)

    expect(screen.getByText(/test/i)).toBeInTheDocument()
    expect(screen.getByText(/link/i)).toBeInTheDocument()
    expect(screen.getAllByRole("link")).toHaveLength(data.length)
  })

  it("Navbar snapshot", () => {
    const title = render(<Navbar list={data} />)

    expect(title).toMatchSnapshot()
  })
})