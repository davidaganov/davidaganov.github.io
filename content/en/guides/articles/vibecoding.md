---
title: Mindful Vibe-Coding
description: An article about how I use AI in my work and why I don't think it replaces developers.
icon: i-lucide-file-text
habrUrl: https://habr.com/ru/articles/982452/
publishedAt: 2026-01-02
readingTime: 6 min
tags:
  - Artificial Intelligence
  - Development
---

# Mindful Vibe-Coding

> This isn't a guide — it's just another article about AI. Below is my personal experience and perspective on how AI is currently integrated into development. No attempt to convince anyone, just a description of what works for me and what doesn't.

Enough has been said and written about vibe-coding already.

Some people think that code written with AI is inherently unmaintainable, scales poorly, and takes longer to debug than writing everything from scratch.
Others, on the contrary, argue that such code is perfectly suited for small startups, freelance work, or even that the concept of "clean code" is dead — the only thing that matters is that it works.

In my view, both sides are only partially right. There are a lot of extremes in the discussion around this topic. AI is just a tool that, in the right hands, can greatly simplify life. At the same time, I don't think the market has yet produced a specialist who works maximally efficiently with AI — we're all still learning how to apply it.

## What I Use

### Models

**Claude Sonnet 4.5** — currently the best model for coding under my tasks. It most often gives a predictable result. I've tried replacing it, but haven't found a full alternative for myself yet.  
**GPT 5.2** — I use mainly for communication and design: discussing an idea, drafting a work plan, choosing a stack, laying out options by pros and cons, structuring thoughts.

### Software

**Cursor** — has been my main editor for about a year. The main advantage, in my opinion, is the **Plan** mode: it asks clarifying questions and produces a MD file describing the task and a list of what needs to be done. Cursor then works with the code guided by this file.  
**Windsurf** — I started using it when I ran out of tokens in my Cursor subscription. The free version includes GPT 5.2, which is quite enough for less complex tasks. Works well for design, prototypes, and quick experiments. (And you can generate as many new accounts as you want with 10-minute email addresses.)

### Pet Projects

Since my school days I've had many ideas for software, websites, and services. But almost always everything came down to either a lack of skill or the time it would take to implement. Now AI largely closes these gaps and acts as a crutch that lets you move forward.

Here's what my first steps look like when creating a new project:

1. An idea appears. For example, a personal finance tracking service. I discuss it with ChatGPT: what's the best form to implement it in, what technologies to use, how to host it, what the desired end result is. I ask it to ask me 10–15 questions whose answers will help when building the plan.
2. After that, I ask it to build a plan taking my answers and the conversation context into account. I get a MD file, carefully review it, gather my own questions, clarify and edit things. When the file becomes clear and logical — I consider it ready to work with.
3. I put that file in an empty project folder, pass it as context to a chat, and ask it to build the architecture and install dependencies. In parallel, I manually set up my own configs for eslint, prettier, editorconfig, and fix small details that are important and familiar to me.

At first glance, this might seem like extra steps, and it would be simpler to just start writing code. But this process satisfies my need for a specification and eliminates the need to redo the same things multiple times during development.

In essence, I start working as if I've already been given a project with a clear spec, architecture, requirements, and a general understanding of the final result. The scope of work is also immediately visible, which is often lacking when working on pet projects. I break the resulting plan into tasks or sprints and then simply focus on implementation. This is exactly why I stopped abandoning pet projects halfway and started bringing them to completion more often.

On top of that, the neural network in this case receives not 3-4 abstract sentences as input, but a quite clear and structured description of the task, which it works with noticeably better.

## Work Tasks

Writing that tasks need to be broken into small pieces is probably not even worth mentioning. But I often notice other problems in people when they try to integrate AI into their workflow.

The most common negative experience is related to not passing the necessary context to the agent. People don't attach the specific files that need to be worked on, don't specify constraints, and don't explain what's already in the project. For example, that existing functions, helpers, or composables need to be reused.

It's important to understand a simple thing: the neural network **doesn't hold the entire project in its head**. Don't rely on it going off, browsing the repository, finding the needed function in some `utils` folder, and neatly importing it. In practice, this almost never happens.

If you're working on a task related to time — attach the helper where functions for that already exist.  
If you don't know exactly where the needed code is in the project — say directly to browse the code and find files related to the task.  
If you want to work on a specific module — put the whole folder in context and ask it to study it carefully.

To summarize: imagine all the knowledge domain needed to solve your task, and **explicitly pass it to the agent**. This could be files, folders, instructions to find the needed information inside the project or on the internet. The latter is especially relevant for fresh libraries — in such cases it's better to immediately ask it to google the documentation rather than relying on the model's knowledge (with something like Google Maps, all models kept suggesting deprecated methods until I asked them to find the documentation, and sometimes I just dropped links to specific sections directly into the chat).

I also almost always ask for such basic things as:

- use best practices
- ask me questions **before** writing code
- clarify points related to scalability
- think about solution reuse

_I understand this sounds obvious, but many people neglect these simple steps and get a significantly worse result that requires more manual work afterward._

My typical workflow looks like this:

1. I take the task description or formulate it myself. I attach as many files and examples as possible, specify in advance what new files need to be created and where they should go. At the end, I ask it to ask additional questions and clarify the goal of the work.
2. I answer the questions, read the neural network's feedback, evaluate how "in context" it is, and only then give the command to start.
3. The first iteration almost always looks like a roughly hewn piece of stone. Then I go through the code line by line: fix the style, align approaches, remove rough edges. At this stage it's important not to make large-scale changes — the goal is to get a working solution.
4. After I've fixed everything, brought it to a consistent style, and eliminated errors, I open a new chat. I pass all the edited files there, describe the context of the work done, and ask it to evaluate the solution. Often at this stage the neural network finds duplicated code, questionable spots, potential bugs, or typing issues. This allows getting additional feedback even before review.

The goal of this approach is to shift focus from manually solving the task to managing the process. Less mechanical work and more control over the result.

At first it may seem slower than writing code yourself. But over time you get better oriented and noticeably increase your productivity. The approach is quite flexible and depends on the scope of work: sometimes there's no need for additional checks, sometimes problems are immediately visible and solved manually.

But the general pipeline eliminates the pain of lengthy mechanical keystrokes in situations where the solution is already in your head. In such cases it's often more beneficial to review a ready-made version, adapt it to your vision, or even pick up an idea you hadn't got to yet yourself.

## The Limits of Vibe-Coding

I want to say something separately about generating entire sites and applications without any human oversight. Various services along the lines of "make me a site or app from a description" look impressive, but in practice I consider this approach unviable.

In the early stages everything can genuinely look fine. You can even take screenshots of the app and post them online to impress the skeptics about the inevitable progress and the coming reduction of the entire IT industry. But problems almost always start the moment you need to make changes, debug an issue, or build a new feature. Without understanding the architecture and what's happening in the code, you very quickly lose control of the system.

For the same reason I think vibe-coding without a solid technical foundation is a dead end. If you don't understand what the generated code does, you can't evaluate its quality, make an architectural decision, or spot a problem in time.

At the same time, I don't consider such tools useless. Perhaps thanks to them, in the near future the very concept of MVP will disappear, and clients will come already with a result generated by AI. Or designers will start demonstrating layouts and product ideas in this format. But as soon as the conversation turns to a live project, support, scaling, and accountability for the result, everything starts to fall apart without control and understanding of the process.

---

## Conclusion

For me, vibe-coding is not an attempt to shift responsibility to a neural network, nor a way to "write code without thinking." It's a tool that helps you get from idea to result faster, if you understand exactly what you're doing and why.

Where there is control, context, and understanding of the process, AI genuinely saves time and effort. Where these are absent, it only creates an illusion of speed. In that sense, vibe-coding is not about abandoning engineering thinking — it's about amplifying it. I hope that skeptics will try it and realize that AI can make their lives a little easier, and solving routine tasks will take a back seat, giving you the opportunity to grow professionally just a little bit faster.
