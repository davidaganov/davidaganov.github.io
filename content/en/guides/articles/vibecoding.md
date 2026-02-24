---
title: Conscious Vibe Coding
description: How I use AI in my workflow and why I don’t see it replacing developers.
icon: i-lucide-file-text
habrUrl: https://habr.com/ru/articles/982452/
publishedAt: 2026-01-02
readingTime: 6 min
tags:
  - Artificial Intelligence
  - Development
---

# Conscious Vibe Coding

> This is not a guide, but just another article about AI. Below is my personal experience and perspective on how AI is currently being integrated into development. Without trying to convince anyone, but with a description of what works for me and what doesn't.

Enough has already been said and written about vibe coding.

Some believe that code written with the help of AI is inherently unmaintainable, scales poorly, and takes longer to debug than writing everything from scratch.  
Others, conversely, say that such code is perfectly suitable for small startups, freelance, or even that the concept of "clean code" is dead—the main thing is that it works.

In my opinion, both are only partially right. There are many extremes surrounding the discussion of this topic. AI is just a tool that, in the right hands, can greatly simplify life. At the same time, I don't believe a specialist who works with AI with maximum efficiency has appeared on the market yet; we are all still just learning how to apply it.

## What I Use

### Models

**Claude Sonnet 4.5** - currently the best model for coding for my tasks. It most often gives a predictable result. I've tried replacing it, but haven't found a full alternative for myself yet.  
**GPT 5.2** - I use it mainly for communication and design: discussing ideas, sketching out work plans, picking a stack, weighing pros and cons of different options, and structuring thoughts.

### Software

**Cursor** - has been my primary editor for about a year. The main advantage, in my opinion, is the **Plan** mode: it asks clarifying questions and outputs an MD file with a task description and a list of things to do. Cursor then works with the code, focusing specifically on this file.  
**Windsurf** - I started using it when I ran out of tokens in my Cursor subscription. The free version has GPT 5.2, which is quite enough for less complex tasks. It's well-suited for design, prototypes, and quick experiments (and you can generate as many new accounts as you want using 10-minute mail).

### Pet Projects

Ever since my school days, I've had many ideas for software, websites, and services. But almost always, everything stalled due to either a lack of skill or the time it would take to implement. Now AI largely covers these problems and acts as a crutch that allows me to move forward.

This is what my first steps in creating a new project look like now:

1.  An idea appears. For example, a service for finance tracking. I discuss it with ChatGPT: in what form it's best to implement, on what technologies, how it can be hosted, and what the final goal is. I ask it to ask 10–15 questions, the answers to which will help in building a plan.
2.  After that, I ask to build a plan considering my answers and the dialogue context. I get an MD file, review it carefully, gather my questions, clarify some things, and make edits. When the file becomes clear and logical—I consider it ready for work.
3.  I put this file in an empty project folder, pass it as context to the chat, and ask it to build the architecture and install dependencies. Parallelly, I manually add my configs for eslint, prettier, editorconfig, and fix minor things that are important and familiar to me.

At first glance, it might seem like these are extra steps and it would be easier to just start writing code. But through this process, I cover my need for a technical specification (TS) and eliminate the need to redo the same thing several times during development.

Essentially, I start working as if I've already been given a project with a clear TS, architecture, requirements, and a general understanding of the final result. At the same time, the horizon of work is immediately visible, which is often lacking when working on pet projects. I break the resulting plan into tasks or sprints and then just deal with the implementation. This is exactly why I stopped abandoning pet projects halfway through and started finishing them more often.

Additionally, in such cases, the neural network receives not 3-4 abstract sentences, but a quite coherent and structured task description, which it works with significantly better.

## Work Tasks

I probably don't even need to write about the fact that tasks should be broken down into small ones. But at the same time, I often notice other problems when people try to integrate AI into their workflow.

Most often, negative experiences are related to not providing the agent with the necessary context. People don't attach specific files that work should be done on, don't specify constraints, and don't explain what already exists in the project. For example, that existing functions, helpers, or composables should be reused.

It's important to understand a simple thing: the neural network **does not keep the entire project in its head**. You shouldn't rely on it to go and scan the repository, find the right function in some `utils` folder, and carefully import it. In reality, this almost never happens.

If you're doing a task related to working with time—attach a helper that already has functions for this.  
If you don't know exactly where the needed part is in the project—tell it directly to go through the code and look for files related to the task.  
If you want to work on a specific module—drop the entire folder into the context and ask it to study it carefully.

To generalize: imagine the entire domain of knowledge you need to solve the task and **explicitly pass it to the agent**. This could be files, folders, instructions to find information inside the project or on the internet. The latter is especially relevant for fresh libraries; in such cases, it's better to immediately ask it to google the documentation rather than rely on the model's knowledge (with the same google maps, all models suggested deprecated methods until I asked to find the documentation, and sometimes I just dropped links to specific sections directly into the chat).

I also almost always ask for such trivial things as:

- use best practices
- ask me questions **before** writing code
- clarify points related to scalability
- think about reusability of solutions

_I understand it sounds obvious, but many neglect these simple steps and get a significantly worse result that requires more manual work later._

My workflow usually looks like this:

1.  Take the task text or formulate it myself. Attach maximum files and examples, say in advance which new files need to be created and where they should be located. At the end, ask it to ask additional questions and clarify the goal of the work.
2.  Answer the questions, read the neural network's feedback, assess how much it is "in context," and only then give the command to start.
3.  The first iteration almost always looks like a rough piece of stone. Then I go through the code line by line: fix the style, align approaches, remove rough edges. At this stage, it's important not to make major overhauls; the goal is to get a working solution.
4.  After fixing everything, bringing it to a general style, and eliminating errors, I open a new chat. I pass all the edited files there, describe the context of the work done, and ask it to evaluate the solution. Often at this stage, the neural network finds duplicate code, questionable spots, potential errors, or typing problems. This allows for additional feedback even before the review.

The goal of this approach is to shift focus from manual task solving to process management. Fewer mechanical actions and more control over the result.

At first, this may seem longer than writing the code yourself. But over time, you start to navigate faster and significantly increase productivity. The approach is quite flexible and depends on the volume of work: in some places, you don't need additional double-checking; in others, problems are visible immediately and solved manually.

But the general pipeline closes the pain of long mechanical code typing in situations where the solution is already in your head. In such cases, it's often more beneficial to review a finished version, adjust it to your vision, or even peek at an idea that you haven't managed to reach yourself yet.

## The Boundaries of Vibe Coding

I want to specifically mention the generation of entire websites and applications without any human control. Various services in the spirit of "make me a website or app from a description" look impressive, but in practice, I consider such an approach unsustainable.

In the early stages, everything can indeed look fine. You can even take screenshots of the app and post them on the internet to prove wrong those who don't believe in inevitable progress and the imminent reduction of the entire IT industry. But problems almost always start exactly at the moment when you need to make corrections, figure out a bug, or build a new feature. Without understanding the architecture and what's happening in the code, you lose control over the system very quickly.

For this same reason, I consider vibe coding without a strong technical foundation to be a dead end. If you don't understand exactly what the generated code is doing, you cannot evaluate its quality, make an architectural decision, or notice a problem in time.

That said, I don't consider such tools useless. Perhaps, thanks to them, the very concept of an MVP will disappear in the near future, and clients will come with a result already generated by AI. Or designers will start demonstrating layouts and product ideas in this format. But as soon as it comes to a live project, maintenance, scaling, and responsibility for the result, everything starts to fall apart without control and understanding of the process.

---

## Conclusion

For me, vibe coding is not an attempt to shift responsibility to the neural network or a way to "write code without thinking." It's a tool that helps you get from idea to result faster if you understand exactly what you're doing and why.

Where there is control, context, and understanding of the process, AI really saves time and effort. Where these are missing, it only creates an illusion of speed. And in this sense, vibe coding is not about abandoning engineering thinking, but about enhancing it. I hope that those who have doubts will try it and realize that AI can make their lives a little easier, and solving routine tasks will take a backseat, giving the opportunity to grow professionally a little bit faster.
