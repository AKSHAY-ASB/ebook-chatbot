/**
 * ==========================================================
 * FUNCTION : calculateActualProfileRanking
 * MODULE   : Actual Profile Ranking Engine
 *
 * PURPOSE
 *   Reusable version of the working
 *   testActualBrideRankingV2() ranking engine.
 *
 * MATCHING RULE
 *   bride -> groom
 *   groom -> bride
 *   other -> other
 *
 * IMPORTANT
 *   This function contains NO UI logic.
 *   It only calculates and returns ranking data.
 *
 * SOURCE
 *   Refactored from testActualBrideRankingV2()
 * ==========================================================
 */

function calculateActualProfileRanking(
  viewerId,
  viewerType
) {

  // ==========================================================
  // CONFIG / SAFE INPUT
  // ==========================================================

  const safeViewerId =
    String(
      viewerId || ""
    )
    .trim();


  const safeViewerType =
    String(
      viewerType || ""
    )
    .trim()
    .toLowerCase();


  // ==========================================================
  // VALIDATION
  // ==========================================================

  if (
    !safeViewerId
  ) {

    throw new Error(
      "Viewer ID is required."
    );

  }


  if (
    safeViewerType !== "bride" &&
    safeViewerType !== "groom" &&
    safeViewerType !== "other"
  ) {

    throw new Error(
      "Invalid viewer profile type."
    );

  }


  // ==========================================================
  // LOAD VIEWER
  // ==========================================================

  const viewer =
    getMatchingViewerProfile(
      safeViewerId,
      safeViewerType
    );


  if (
    !viewer ||
    viewer.success !== true ||
    !viewer.profile
  ) {

    throw new Error(
      "Unable to load viewer profile."
    );

  }


  const viewerProfile =
    viewer.profile;


  // ==========================================================
  // VIEWER EXPECTATION
  // ==========================================================

  const viewerExpectation =
    String(
      viewer.expectation ||
      viewer.expectationRaw ||
      viewerProfile.expectationRaw ||
      ""
    )
    .trim();


  if (
    !viewerExpectation
  ) {

    throw new Error(
      "Viewer expectation is required."
    );

  }


  // ==========================================================
  // VIEWER EXPECTATION CRITERIA
  // ==========================================================

  const expectationCriteria =
    parseExpectationCriteria(
      viewerExpectation
    );


  if (
    !expectationCriteria ||
    typeof expectationCriteria !== "object"
  ) {

    throw new Error(
      "Unable to parse expectation criteria."
    );

  }


  // ==========================================================
  // VIEWER ACTUAL PROFILE CRITERIA
  // ==========================================================

  let actualProfileCriteria =
    null;


  if (
    viewerProfile.actualProfileCriteria &&
    typeof viewerProfile.actualProfileCriteria ===
      "object"
  ) {

    actualProfileCriteria =
      viewerProfile.actualProfileCriteria;

  }


  // ==========================================================
  // FALLBACK ACTUAL PROFILE CRITERIA
  // ==========================================================

  if (
    !actualProfileCriteria
  ) {

    actualProfileCriteria = {

      district:
        viewerProfile.district &&
        typeof viewerProfile.district === "object"

          ? viewerProfile.district.raw || ""

          : viewerProfile.district || "",


      education:
        viewerProfile.education &&
        typeof viewerProfile.education === "object"

          ? viewerProfile.education.raw || ""

          : viewerProfile.education || "",


      profession:
        viewerProfile.profession &&
        typeof viewerProfile.profession === "object"

          ? viewerProfile.profession.raw || ""

          : viewerProfile.profession || "",


      employmentType:
        viewerProfile.employmentType ||

        (
          viewerProfile.profession &&
          viewerProfile.profession.employmentType
        ) ||

        "NOT_SPECIFIED",


      caste:
        viewerProfile.caste &&
        typeof viewerProfile.caste === "object"

          ? viewerProfile.caste.raw || ""

          : viewerProfile.caste || "",


      rashi:
        viewerProfile.rashi &&
        typeof viewerProfile.rashi === "object"

          ? viewerProfile.rashi.raw || ""

          : viewerProfile.rashi || "",


      age:
        viewerProfile.age &&
        viewerProfile.age.decimalAge != null

          ? viewerProfile.age.decimalAge

          : null,


      height:
        viewerProfile.height &&
        viewerProfile.height.totalInches != null

          ? viewerProfile.height.totalInches

          : null,


      income:
        viewerProfile.income &&
        typeof viewerProfile.income === "object"

          ? (

              viewerProfile.income.min != null &&
              viewerProfile.income.max != null

                ? {

                    min:
                      viewerProfile.income.min,

                    max:
                      viewerProfile.income.max

                  }

                : viewerProfile.income.value != null

                  ? viewerProfile.income.value

                  : ""

            )

          : viewerProfile.income || ""

    };

  }


  // ==========================================================
  // DETERMINE CANDIDATE TYPE
  // ==========================================================

  const candidateType =
    getOppositeMatchingProfileType(
      safeViewerType
    );


  if (
    !candidateType
  ) {

    throw new Error(
      "Unable to determine candidate profile type."
    );

  }


  // ==========================================================
  // LOAD NORMALIZED CANDIDATES
  // ==========================================================

  const candidateResult =
    getNormalizedMatchingCandidates(
      candidateType
    );


  if (
    !candidateResult ||
    candidateResult.success !== true
  ) {

    throw new Error(
      "Unable to load candidate profiles."
    );

  }


  const profiles =
    Array.isArray(
      candidateResult.profiles
    )

      ? candidateResult.profiles

      : [];


  if (
    profiles.length === 0
  ) {

    throw new Error(
      "No candidate profiles found."
    );

  }


  // ==========================================================
  // RESULTS
  // ==========================================================

  const results = [];


  // ==========================================================
  // DIAGNOSTIC
  // ==========================================================

  const diagnostic = {

    loaded:
      profiles.length,

    invalidProfile:
      0,

    mutualHardFail:
      0,

    profileGateFail:
      0,

    accepted:
      0

  };


  // ==========================================================
  // PROCESS EVERY CANDIDATE
  // ==========================================================

  profiles.forEach(
    function(profile) {

      try {

        // ======================================================
        // BASIC VALIDATION
        // ======================================================

        if (
          !profile ||
          !profile.id ||
          !profile.name
        ) {

          diagnostic.invalidProfile++;

          return;

        }


        // ======================================================
        // SKIP VIEWER'S OWN PROFILE
        // ======================================================

        if (
          String(
            profile.id
          ).trim() ===
          String(
            safeViewerId
          ).trim()
        ) {

          return;

        }


        // ======================================================
        // NORMALIZE CANDIDATE
        // ======================================================

        const normalizedResult =
          normalizeCandidateCriteria(
            profile
          );


        if (
          !normalizedResult ||
          normalizedResult.success !== true ||
          !normalizedResult.criteria
        ) {

          diagnostic.invalidProfile++;

          return;

        }


        const compatibilityCandidate =
          normalizedResult.criteria || {};


        // ======================================================
        // PRESERVE ACTUAL PROFILE CRITERIA
        // ======================================================

        compatibilityCandidate.actualProfileCriteria =
          (
            profile &&
            profile.actualProfileCriteria
          )

            ? profile.actualProfileCriteria

            : {};


        // ======================================================
        // CANDIDATE EXPECTATION
        // ======================================================

        const candidateExpectation =
          String(
            compatibilityCandidate.expectationRaw ||
            profile.expectationRaw ||
            profile.expectation ||
            ""
          )
          .trim();


        const hasExpectation =
          candidateExpectation.length > 0;


        // ======================================================
        // MEANINGFUL EXPECTATION
        // ======================================================

        let hasMeaningfulExpectation =
          false;


        if (
          typeof hasMeaningfulMatchingExpectation ===
          "function"
        ) {

          hasMeaningfulExpectation =
            hasMeaningfulMatchingExpectation(
              candidateExpectation
            ) === true;

        }

        else {

          hasMeaningfulExpectation =
            hasExpectation;

        }


        // ======================================================
        // PHASE 1
        // VIEWER → CANDIDATE HARD MATCH
        // ======================================================

        let viewerToCandidateHard = {

          hardMatch:
            false,

          matchStatus:
            "NO_HARD_CRITERIA",

          applicableCriteria:
            0,

          matchedCriteria:
            0,

          failedCriteria:
            []

        };


        try {

          if (
            typeof evaluateCandidateMatch ===
            "function"
          ) {

            viewerToCandidateHard =
              evaluateCandidateMatch(
                profile,
                expectationCriteria
              ) ||
              viewerToCandidateHard;

          }

        }

        catch (error) {

          console.error(
            "VIEWER → CANDIDATE HARD ERROR:",
            error
          );

        }


        // ======================================================
        // VIEWER → CANDIDATE EXPECTATION
        // ======================================================

        let viewerToCandidateExpectation = {

          applicable:
            false,

          score:
            0,

          maxScore:
            0,

          percentage:
            0,

          matchedKeywords:
            []

        };


        if (
          hasMeaningfulExpectation &&
          typeof calculateWeightedExpectationCompatibility ===
          "function"
        ) {

          try {

            viewerToCandidateExpectation =
              calculateWeightedExpectationCompatibility(
                viewerExpectation,
                candidateExpectation
              ) ||
              viewerToCandidateExpectation;

          }

          catch (error) {

            console.error(
              "VIEWER → CANDIDATE EXPECTATION ERROR:",
              error
            );

          }

        }


        // ======================================================
        // VIEWER → CANDIDATE PROFILE
        // ======================================================

        let viewerToCandidateProfile = {

          applicable:
            false,

          percentage:
            0,

          matched:
            0,

          failed:
            0,

          unknown:
            0,

          totalChecks:
            0,

          matchedCriteria:
            [],

          failedCriteria:
            [],

          unknownCriteria:
            []

        };


        if (
          actualProfileCriteria &&
          typeof calculateActualProfileCompatibility ===
          "function"
        ) {

          try {

            viewerToCandidateProfile =
              calculateActualProfileCompatibility(
                actualProfileCriteria,
                compatibilityCandidate
              ) ||
              viewerToCandidateProfile;

          }

          catch (error) {

            console.error(
              "VIEWER → CANDIDATE PROFILE ERROR:",
              error
            );

          }

        }


        // ======================================================
        // CANDIDATE ACTUAL PROFILE CRITERIA
        // ======================================================

        const candidateActualProfileCriteria =
          compatibilityCandidate.actualProfileCriteria &&
          typeof compatibilityCandidate.actualProfileCriteria ===
          "object"

            ? compatibilityCandidate.actualProfileCriteria

            : null;


        // ======================================================
        // PHASE 2
        // CANDIDATE → VIEWER HARD MATCH
        //
        // IMPORTANT:
        // This is intentionally kept identical to the
        // working testActualBrideRankingV2() logic.
        // ======================================================

        let candidateToViewerHard = {

          hardMatch:
            false,

          matchStatus:
            "NO_HARD_CRITERIA",

          applicableCriteria:
            0,

          matchedCriteria:
            0,

          failedCriteria:
            []

        };


        if (
          candidateActualProfileCriteria
        ) {

          try {

            candidateToViewerHard =
              evaluateCandidateMatch(
                viewerProfile,
                parseExpectationCriteria(
                  candidateExpectation
                )
              ) ||
              candidateToViewerHard;

          }

          catch (error) {

            console.error(
              "CANDIDATE → VIEWER HARD ERROR:",
              error
            );

          }

        }


        // ======================================================
        // MUTUAL HARD MATCH
        // ======================================================

        const viewerHardFailed =
          viewerToCandidateHard &&
          viewerToCandidateHard.matchStatus !==
            "HARD_MATCH" &&
          viewerToCandidateHard.matchStatus !==
            "NO_HARD_CRITERIA";


        const candidateHardFailed =
          candidateToViewerHard &&
          candidateToViewerHard.matchStatus !==
            "HARD_MATCH" &&
          candidateToViewerHard.matchStatus !==
            "NO_HARD_CRITERIA";


        const mutualHardMatch =
          !viewerHardFailed &&
          !candidateHardFailed;


        // ======================================================
        // MUTUAL PROFILE
        // ======================================================

        let mutualProfile = {

          applicable:
            false,

          percentage:
            0,

          matched:
            0,

          failed:
            0,

          unknown:
            0,

          totalChecks:
            0

        };


        try {

          if (
            typeof calculateMutualProfileCompatibility ===
            "function"
          ) {

            mutualProfile =
              calculateMutualProfileCompatibility(
                viewerProfile,
                compatibilityCandidate
              ) ||
              mutualProfile;

          }

        }

        catch (error) {

          console.error(
            "MUTUAL PROFILE ERROR:",
            error
          );

        }


        // ======================================================
        // MUTUAL EXPECTATION
        // ======================================================

        let mutualExpectation = {

          applicable:
            false,

          score:
            0,

          maxScore:
            0,

          percentage:
            0,

          matchedKeywords:
            []

        };


        try {

          const candidateToViewerExpectation =
            calculateWeightedExpectationCompatibility(
              candidateExpectation,
              viewerExpectation
            );


          mutualExpectation =
            calculateMutualExpectationCompatibility(
              viewerToCandidateExpectation,
              candidateToViewerExpectation
            ) ||
            mutualExpectation;

        }

        catch (error) {

          console.error(
            "MUTUAL EXPECTATION ERROR:",
            error
          );

        }


        // ======================================================
        // FINAL MUTUAL COMPATIBILITY SCORE
        // ======================================================

        let finalMutual = {

          finalScore:
            0,

          finalPercentage:
            0,

          hardScore:
            0,

          expectationScore:
            0,

          profileScore:
            0

        };


        try {

          finalMutual =
            calculateFinalMutualCompatibilityScore(
              mutualHardMatch,
              mutualExpectation,
              mutualProfile
            ) ||
            finalMutual;

        }

        catch (error) {

          console.error(
            "FINAL MUTUAL SCORE ERROR:",
            error
          );

        }


        // ======================================================
        // FINAL HARD MATCH GATE
        // ======================================================

        if (
          mutualHardMatch !== true
        ) {

          diagnostic.mutualHardFail++;

          return;

        }


        // ======================================================
        // PROFILE GATE
        //
        // NOTE:
        // Kept exactly as in the working source.
        // profileGateFail is currently diagnostic only.
        // ======================================================

        const profileApplicable =
          mutualProfile &&
          mutualProfile.applicable === true;


        const profileMatched =
          Number(
            mutualProfile &&
            mutualProfile.matched
          ) || 0;

         
        // ==========================================================
        // ACCEPT CANDIDATE
        // ==========================================================

        diagnostic.accepted++;


        // ==========================================================
        // PROFILE PHOTO — FINAL SAFE VALUE
        //
        // IMPORTANT:
        // The matching engine must return the same photo URL
        // that the normal profile search uses.
        //
        // Priority:
        // 1. profile.photo
        // 2. profile.photoRaw
        // 3. profile.photoUrl
        // 4. profile.profilePhoto
        // ==========================================================

        let candidatePhotoRaw =
          profile &&
          (
            profile.photo ||
            profile.photoRaw ||
            profile.photoUrl ||
            profile.profilePhoto ||
            ""
          );

        candidatePhotoRaw =
          String(
            candidatePhotoRaw || ""
          ).trim();


        // ==========================================================
        // CONVERT PHOTO URL
        //
        // Existing normalizer already converts Google Drive
        // photo links. We also protect this layer here so that
        // ranking results always contain a browser-displayable URL.
        // ==========================================================

        let candidatePhoto =
          candidatePhotoRaw;

        if (
          candidatePhotoRaw &&
          typeof convertProfilePhotoUrl ===
            "function"
        ) {

          try {

            const convertedPhoto =
              convertProfilePhotoUrl(
                candidatePhotoRaw
              );

            if (
              convertedPhoto &&
              String(
                convertedPhoto
              ).trim()
            ) {

              candidatePhoto =
                String(
                  convertedPhoto
                ).trim();

            }

          }
          catch (photoError) {

            console.warn(
              "MATCHING PHOTO CONVERSION FAILED:",
              profile.id,
              photoError
            );

            // Keep original URL as fallback
            candidatePhoto =
              candidatePhotoRaw;

          }

        }


        // ==========================================================
        // PHOTO DEBUG
        // ==========================================================

        console.log(
          "📸 MATCHING FINAL PHOTO:",
          JSON.stringify(
            {
              id:
                profile.id || "",

              name:
                profile.name || "",

              photoRaw:
                candidatePhotoRaw,

              photo:
                candidatePhoto
            },
            null,
            2
          )
        );


        // ==========================================================
        // FINAL RESULT
        // ==========================================================

        results.push({

          // ========================================================
          // BASIC PROFILE
          // ========================================================

          id:
            profile.id || "",

          name:
            profile.name || "",

          type:
            profile.type || "",


          // ========================================================
          // PROFILE PHOTO
          // ========================================================

          photo:
            candidatePhoto,

          photoRaw:
            candidatePhotoRaw,


          found:
            true,


          // ========================================================
          // PROFILE DISPLAY DATA
          // ========================================================

          district:
            profile.district || "",

          ageRaw:
            profile.ageRaw || "",

          age:
            profile.age || "",

          heightRaw:
            profile.heightRaw || "",

          height:
            profile.height || "",

          incomeRaw:
            profile.incomeRaw || "",

          income:
            profile.income || "",

          casteRaw:
            profile.casteRaw || "",

          caste:
            profile.caste || "",

          educationRaw:
            profile.educationRaw || "",

          education:
            profile.education || "",

          professionRaw:
            profile.professionRaw || "",

          profession:
            profile.profession || "",

          rashiRaw:
            profile.rashiRaw || "",

          rashi:
            profile.rashi || "",

          address:
            profile.address || "",


          // ========================================================
          // EXPECTATION
          // ========================================================

          hasExpectation:
            hasExpectation,

          hasMeaningfulExpectation:
            hasMeaningfulExpectation,


          // ========================================================
          // MUTUAL HARD MATCH
          // ========================================================

          hardMatch:
            mutualHardMatch === true,

          matchStatus:
            mutualHardMatch === true
              ? "MUTUAL_HARD_MATCH"
              : "NO_HARD_CRITERIA",

          hardScore:
            Number(
              finalMutual &&
              finalMutual.hardScore
            ) || 0,


          // ========================================================
          // MUTUAL EXPECTATION
          // ========================================================

          expectationCompatibilityScore:
            Number(
              mutualExpectation &&
              mutualExpectation.score
            ) || 0,

          expectationCompatibilityMaxScore:
            Number(
              mutualExpectation &&
              mutualExpectation.maxScore
            ) || 0,

          expectationCompatibilityPercentage:
            Number(
              mutualExpectation &&
              mutualExpectation.percentage
            ) || 0,

          matchedExpectationKeywords:
            Array.isArray(
              mutualExpectation &&
              mutualExpectation.matchedKeywords
            )
              ? mutualExpectation.matchedKeywords
              : [],


          // ========================================================
          // MUTUAL PROFILE
          // ========================================================

          profileCompatibilityApplicable:
            mutualProfile &&
            mutualProfile.applicable === true,

          profileCompatibilityPercentage:
            Number(
              mutualProfile &&
              mutualProfile.percentage
            ) || 0,

          profileMatched:
            Number(
              mutualProfile &&
              mutualProfile.matched
            ) || 0,

          profileFailed:
            Number(
              mutualProfile &&
              mutualProfile.failed
            ) || 0,

          profileUnknown:
            Number(
              mutualProfile &&
              mutualProfile.unknown
            ) || 0,

          profileTotalChecks:
            Number(
              mutualProfile &&
              mutualProfile.totalChecks
            ) || 0,


          // ========================================================
          // FINAL MUTUAL SCORE
          // ========================================================

          finalScore:
            Number(
              finalMutual &&
              finalMutual.finalScore
            ) || 0,

          finalPercentage:
            Number(
              finalMutual &&
              finalMutual.finalPercentage
            ) || 0,

          rankingScore:
            Number(
              finalMutual &&
              finalMutual.finalScore
            ) || 0,

          rankingPercentage:
            Number(
              finalMutual &&
              finalMutual.finalPercentage
            ) || 0,


          // ========================================================
          // RANKING MODE
          // ========================================================

          rankingMode:
            "FINAL_MUTUAL_COMPATIBILITY"

        });

          

      }

      catch (error) {

        if (
          !profile ||
          !profile.id ||
          !profile.name
        ) {

          diagnostic.invalidProfile++;

        }


        console.error(
          "CANDIDATE PROCESSING ERROR:",
          error
        );

        // Continue processing remaining candidates.

      }

    }
  );


  // ==========================================================
  // REMOVE DUPLICATES
  // ==========================================================

  const uniqueResultsMap =
    new Map();


  results.forEach(
    function(item) {

      const key =
        String(
          item.id || ""
        )
        .trim()
        .toUpperCase();


      if (
        !key
      ) {

        return;

      }


      const existing =
        uniqueResultsMap.get(
          key
        );


      if (
        !existing ||
        item.rankingScore >
        existing.rankingScore
      ) {

        uniqueResultsMap.set(
          key,
          item
        );

      }

    }
  );


  const uniqueResults =
    Array.from(
      uniqueResultsMap.values()
    );


  // ==========================================================
  // SORT — FINAL MUTUAL RANKING
  // ==========================================================

  uniqueResults.sort(
    function(a, b) {

      // ========================================================
      // 1. MUTUAL HARD MATCH
      // ========================================================

      if (
        a.hardMatch !==
        b.hardMatch
      ) {

        return a.hardMatch
          ? -1
          : 1;

      }


      // ========================================================
      // 2. FINAL MUTUAL SCORE
      // ========================================================

      if (
        a.rankingScore !==
        b.rankingScore
      ) {

        return (
          b.rankingScore -
          a.rankingScore
        );

      }


      // ========================================================
      // 3. MUTUAL PROFILE
      // ========================================================

      if (
        a.profileCompatibilityPercentage !==
        b.profileCompatibilityPercentage
      ) {

        return (
          b.profileCompatibilityPercentage -
          a.profileCompatibilityPercentage
        );

      }


      // ========================================================
      // 4. MUTUAL EXPECTATION
      // ========================================================

      if (
        a.expectationCompatibilityPercentage !==
        b.expectationCompatibilityPercentage
      ) {

        return (
          b.expectationCompatibilityPercentage -
          a.expectationCompatibilityPercentage
        );

      }


      // ========================================================
      // 5. MATCHED EXPECTATION KEYWORDS
      // ========================================================

      if (
        a.matchedExpectationKeywords.length !==
        b.matchedExpectationKeywords.length
      ) {

        return (
          b.matchedExpectationKeywords.length -
          a.matchedExpectationKeywords.length
        );

      }


      // ========================================================
      // 6. NAME
      // ========================================================

      return String(
        a.name || ""
      ).localeCompare(
        String(
          b.name || ""
        )
      );

    }
  );


  // ==========================================================
  // ASSIGN RANK
  // ==========================================================

  uniqueResults.forEach(
    function(candidate, index) {

      candidate.rank =
        index + 1;

    }
  );


  // ==========================================================
  // TOP 10
  // ==========================================================

  const top10 =
    uniqueResults.slice(
      0,
      10
    );


  // ==========================================================
  // SUMMARY
  // ==========================================================

  const summary = {

    viewerId:
      safeViewerId,

    viewerType:
      safeViewerType,

    viewerName:
      viewer.name || "",

    rankingMode:
      "FINAL_MUTUAL_COMPATIBILITY_RANKING",

    totalCandidates:
      uniqueResults.length,

    mutualHardMatched:
      uniqueResults.filter(
        function(item) {

          return (
            item.hardMatch === true
          );

        }
      ).length,

    finalMutualCompatibilityCandidates:
      uniqueResults.filter(
        function(item) {

          return (
            item.rankingMode ===
            "FINAL_MUTUAL_COMPATIBILITY"
          );

        }
      ).length,

    meaningfulExpectationCandidates:
      uniqueResults.filter(
        function(item) {

          return (
            item.hasMeaningfulExpectation ===
            true
          );

        }
      ).length,

    topMatches:
      top10.length

  };


  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    success:
      true,

    viewerId:
      safeViewerId,

    viewerType:
      safeViewerType,

    viewerName:
      viewer.name || "",

    candidateType:
      candidateType,

    actualProfileCriteria:
      actualProfileCriteria,

    diagnostic:
      diagnostic,

    summary:
      summary,

    top10:
      top10,

    allResults:
      uniqueResults

  };

}





function testCalculateActualProfileRanking() {

  const result =
    calculateActualProfileRanking(
      "ID001",
      "groom"
    );


  console.log(
    "=============================================="
  );

  console.log(
    "CALCULATE ACTUAL PROFILE RANKING TEST"
  );

  console.log(
    JSON.stringify(
      result.summary,
      null,
      2
    )
  );


  console.log(
    "=============================================="
  );

  console.log(
    "TOP 10"
  );

  console.log(
    JSON.stringify(
      result.top10,
      null,
      2
    )
  );


  console.log(
    "=============================================="
  );

  console.log(
    "PIPELINE"
  );

  console.log(
    JSON.stringify(
      result.diagnostic,
      null,
      2
    )
  );

}