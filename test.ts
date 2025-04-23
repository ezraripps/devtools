/* eslint-disable */

// This file contains examples of bad code that should be flagged by the linter

// No sql injection
// This is a bad SQL query
export function badSQL(parameters: string[]) {
    // This is a bad SQL query
    return `SELECT * FROM users WHERE name = '${parameters[0]}' AND age = ${parameters[1]}`
}

// Example of a high code complexity function
export function emojiRoulette(seed: number | null): string {
    // Bail out fast on obviously bad input
    if (seed === null) {
        return '💤'
    }

    // Force the number into a 0-99 range
    const n = Math.abs(seed) % 100

    // Nested loops + branching galore — purely for complexity
    let acc = 0
    outer: for (let i = 0; i < n; i++) {
        // pointless inner loop
        for (let j = 0; j < i % 5; j++) {
            acc += (i * j) % 7
            if (acc > 500) {
                break outer
            } // labelled break
        }

        // switch with fall-throughs
        switch (i % 7) {
            case 0:
            case 1:
                acc += 3
                break
            case 2:
                acc ^= 0b1010
                break
            case 3:
                if (acc % 2 === 0) {
                    acc >>= 1
                } else {
                    acc <<= 1
                }
                break
            case 4:
                acc = (acc * 31) % 997
                break
            case 5:
                acc = ~~(Math.sqrt(acc) * 13)
                break
            default:
                acc--
        }

        // a needless ternary chain
        acc = acc % 4 === 0 ? acc + 17 : acc % 3 === 0 ? acc - 9 : acc % 2 === 0 ? acc * 2 : acc + 1
    }

    // Final decision tree (more branches!)
    if (acc % 11 === 0) {
        return '🚀'
    } else if (acc % 7 === 0) {
        return '🎉'
    } else if (acc % 5 === 0) {
        return '🤖'
    } else if (acc % 3 === 0) {
        return '🐙'
    } else if (acc % 2 === 0) {
        return '🍕'
    } else {
        return '🤷'
    }
}

/**
 * ──────────────────────────────────────────────────────────────
 * 1. Magic numbers should not be used ─ typescript:S109
 *    (π is hard-coded instead of coming from a named constant)
 */
export function magicCircleArea(radius: number): number {
    return radius * radius * 3.14159 // Non-compliant magic number ✨
}

/**
 * ──────────────────────────────────────────────────────────────
 * 2. Empty blocks are confusing ─ typescript:S108
 *    (swallows the exception without a comment or handling)
 */
export function swallowError(): void {
    try {
        JSON.parse('{ invalid json }')
    } catch /* oops: nothing here */ {}
}

/**
 * ──────────────────────────────────────────────────────────────
 * 3. “if / else” branches are duplicated ─ typescript:S1301
 *    (both branches do exactly the same thing)
 */
export function duplicateBranch(flag: boolean, value: number): number {
    if (flag) {
        return value * 2 + 10
    } else {
        return value * 2 + 10 // Duplicate logic
    }
}

/**
 * ──────────────────────────────────────────────────────────────
 * 4. Unused parameters clutter APIs ─ typescript:S1172
 *    (`unused` is never referenced)
 */
export function unusedParameterExample(used: string, unused: string): string {
    return `Hello, ${used}!`
}

/**
 * ──────────────────────────────────────────────────────────────
 * 5. TODO comments should be tracked ─ typescript:S1135
 *    (SonarCloud flags “TODO” markers)
 */
export function todoPlaceholder(): void {
    // TODO: Replace console.log with proper logging
    console.log('work in progress…')
}

/**
 * ──────────────────────────────────────────────────────────────
 * 6. Dead stores are wasteful ─ typescript:S1854
 *    (`temp` is written but its first value is never read)
 */
export function deadStore(): number {
    let temp = 42 // First assignment never used
    temp = 84
    return temp
}

/*───────────────────────────────────────────────────────────────────
  1. SQL-Injection vulnerability                     typescript:S5247
     - Requires taint analysis to notice user input flowing
       into the query string.  A stylistic linter can’t follow
       that data path.
*/
export async function insecureGetUser(db: any, username: string) {
    // ⚠️ user-controlled data is concatenated into raw SQL
    const q = `SELECT * FROM users WHERE name = '${username}'`
    return db.query(q)
}

/*───────────────────────────────────────────────────────────────────
    2. Command-Injection vulnerability                  typescript:S2076
       - Same story, but for OS commands.
  */
import { exec } from 'child_process'
export function listFiles(userPath: string) {
    exec('ls ' + userPath, (err, out) => {
        // ⚠️ tainted input
        if (err) throw err
        console.log(out)
    })
}

/*───────────────────────────────────────────────────────────────────
    3. Condition is always true / dead code            typescript:S2583
       - Sonar’s symbolic-execution engine proves the predicate can
         never be false across all iterations.
  */
export function alwaysTrueCheck(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
        if (i >= 0) {
            // always true ⇒ the branch below is dead
            console.log(arr[i])
        }
    }
}

/*───────────────────────────────────────────────────────────────────
    4. Possible null dereference                       typescript:S2259
       - Needs path-sensitive flow analysis to see that `text`
         might still be undefined when it’s dereferenced.
  */
export function riskyLength(text?: string) {
    if (text && text.length > 5) {
        /* … */
    }
    return text!.length // ⚠️ might blow up
}

/*───────────────────────────────────────────────────────────────────
    5. Hard-coded credential                            typescript:S2068
       - Secret-detection heuristics look for “password”, “secret”,
         JWTs, AWS keys, etc.  Linters treat it as an innocent const.
  */
export const PROD_DB_PASSWORD = 'Sup3rS3cret!' // ⚠️ leaks secret

/*───────────────────────────────────────────────────────────────────
    6. “Floating” promise / mis-used promise           typescript:S6544
       - Sonar notices the unresolved promise that could reject and
         crash the process; ESLint can warn only if *extra* plugins
         are enabled, but Sonar’s rule works out of the box.
  */
export async function fireAndForget() {
    fetch('https://api.example.com/data') // ⚠️ not awaited / handled
    console.log('done… maybe')
}
