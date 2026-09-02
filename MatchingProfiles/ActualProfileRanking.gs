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
      viewerProfile.expectation ||
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
  // VIEWER MEANINGFUL EXPECTATION
  //
  // IMPORTANT:
  // "अनुरूप" is generic and must be false.
  // ==========================================================

  let viewerHasMeaningfulExpectation =
    false;


  if (
    typeof hasMeaningfulMatchingExpectation ===
    "function"
  ) {

    viewerHasMeaningfulExpectation =
      hasMeaningfulMatchingExpectation(
        viewerExpectation
      ) === true;

  }

  else {

    viewerHasMeaningfulExpectation =
      viewerExpectation.length > 0;

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
  // HARD MATCH DIAGNOSTIC COUNTERS
  // ==========================================================

  let hardMatchCount = 0;

  let noHardCriteriaCount = 0;

  let hardRejectCount = 0;

  let unknownHardStatusCount = 0;

  const hardStatusExamples = [];


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
        // PRESERVE CANDIDATE ACTUAL PROFILE CRITERIA
        // ======================================================

        compatibilityCandidate.actualProfileCriteria =
          (
            profile &&
            profile.actualProfileCriteria &&
            typeof profile.actualProfileCriteria ===
              "object"
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
        // CANDIDATE MEANINGFUL EXPECTATION
        //
        // "अनुरूप" => false
        // Detailed expectation => true
        // ======================================================

        let candidateHasMeaningfulExpectation =
          false;


        if (
          typeof hasMeaningfulMatchingExpectation ===
          "function"
        ) {

          candidateHasMeaningfulExpectation =
            hasMeaningfulMatchingExpectation(
              candidateExpectation
            ) === true;

        }

        else {

          candidateHasMeaningfulExpectation =
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
        //
        // Calculate ONLY ONCE.
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
          viewerHasMeaningfulExpectation === true &&
          typeof calculateWeightedExpectationCompatibility ===
            "function"
        ) {

          try {

            viewerToCandidateExpectation =
              calculateWeightedExpectationCompatibility(
                viewerExpectation,
                compatibilityCandidate
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

            if (
              typeof evaluateCandidateMatch ===
              "function"
            ) {

              candidateToViewerHard =
                evaluateCandidateMatch(
                  viewerProfile,
                  parseExpectationCriteria(
                    candidateExpectation
                  )
                ) ||
                candidateToViewerHard;

            }

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

        const viewerHardRejected =
          viewerToCandidateHard &&
          viewerToCandidateHard.matchStatus ===
            "HARD_REJECT";


        const candidateHardRejected =
          candidateToViewerHard &&
          candidateToViewerHard.matchStatus ===
            "HARD_REJECT";


        const mutualHardMatch =
          !viewerHardRejected &&
          !candidateHardRejected;


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
        //
        // DIRECTION-AWARE
        //
        // Viewer meaningful:
        //     viewerExpectation → candidate actual profile
        //
        // Candidate meaningful:
        //     candidateExpectation → viewer actual profile
        //
        // Generic "अनुरूप" is ignored.
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
            [],

          viewerToCandidate:
            viewerToCandidateExpectation,

          candidateToViewer:
            null

        };


        // ======================================================
        // CANDIDATE → VIEWER EXPECTATION
        // ======================================================

        let candidateToViewerExpectation = {

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
          candidateHasMeaningfulExpectation === true &&
          typeof calculateWeightedExpectationCompatibility ===
            "function"
        ) {

          try {

            candidateToViewerExpectation =
              calculateWeightedExpectationCompatibility(
                candidateExpectation,
                viewerProfile
              ) ||
              candidateToViewerExpectation;

          }

          catch (error) {

            console.error(
              "CANDIDATE → VIEWER EXPECTATION ERROR:",
              error
            );

          }

        }


        // ======================================================
        // COMBINE MUTUAL EXPECTATION
        // ======================================================

        try {

          if (
            typeof calculateMutualExpectationCompatibility ===
            "function"
          ) {

            mutualExpectation =
              calculateMutualExpectationCompatibility(
                viewerToCandidateExpectation,
                candidateToViewerExpectation
              ) ||
              mutualExpectation;

          }

          else {

            // --------------------------------------------------
            // SAFE FALLBACK
            // --------------------------------------------------

            const viewerApplicable =
              viewerToCandidateExpectation.applicable === true;

            const candidateApplicable =
              candidateToViewerExpectation.applicable === true;


            let score = 0;

            let maxScore = 0;


            if (
              viewerApplicable &&
              candidateApplicable
            ) {

              score =
                Number(
                  viewerToCandidateExpectation.score
                ) || 0;

              score +=
                Number(
                  candidateToViewerExpectation.score
                ) || 0;


              maxScore =
                Number(
                  viewerToCandidateExpectation.maxScore
                ) || 0;

              maxScore +=
                Number(
                  candidateToViewerExpectation.maxScore
                ) || 0;

            }

            else if (
              viewerApplicable
            ) {

              score =
                Number(
                  viewerToCandidateExpectation.score
                ) || 0;

              maxScore =
                Number(
                  viewerToCandidateExpectation.maxScore
                ) || 0;

            }

            else if (
              candidateApplicable
            ) {

              score =
                Number(
                  candidateToViewerExpectation.score
                ) || 0;

              maxScore =
                Number(
                  candidateToViewerExpectation.maxScore
                ) || 0;

            }


            const percentage =
              maxScore > 0

                ? Number(
                    (
                      score /
                      maxScore *
                      100
                    ).toFixed(2)
                  )

                : 0;


            const viewerKeywords =
              Array.isArray(
                viewerToCandidateExpectation.matchedKeywords
              )

                ? viewerToCandidateExpectation.matchedKeywords

                : [];


            const candidateKeywords =
              Array.isArray(
                candidateToViewerExpectation.matchedKeywords
              )

                ? candidateToViewerExpectation.matchedKeywords

                : [];


            mutualExpectation = {

              applicable:
                viewerApplicable ||
                candidateApplicable,

              score:
                score,

              maxScore:
                maxScore,

              percentage:
                percentage,

              matchedKeywords:
                Array.from(
                  new Set(
                    viewerKeywords.concat(
                      candidateKeywords
                    )
                  )
                ),

              viewerToCandidate:
                viewerToCandidateExpectation,

              candidateToViewer:
                candidateToViewerExpectation

            };

          }

        }

        catch (error) {

          console.error(
            "MUTUAL EXPECTATION ERROR:",
            error
          );

        }


        // ======================================================
        // EXPECTATION DIRECTION DEBUG
        // ======================================================

        console.log(
          "EXPECTATION DIRECTION INPUTS:",
          JSON.stringify(
            {

              candidateId:
                compatibilityCandidate.id || "",

              viewerExpectation:
                viewerExpectation,

              candidateExpectation:
                candidateExpectation,

              viewerHasMeaningfulExpectation:
                viewerHasMeaningfulExpectation,

              candidateHasMeaningfulExpectation:
                candidateHasMeaningfulExpectation,

              viewerActualProfile:
                actualProfileCriteria,

              candidateActualProfile:
                candidateActualProfileCriteria

            },
            null,
            2
          )
        );


        // ======================================================
        // MUTUAL EXPECTATION DEBUG
        // ======================================================

        console.log(
          "========== MUTUAL EXPECTATION DEBUG ==========",
          JSON.stringify(
            {

              candidateId:
                compatibilityCandidate.id || "",

              viewerToCandidate:
                viewerToCandidateExpectation,

              candidateToViewer:
                candidateToViewerExpectation,

              mutualExpectation:
                mutualExpectation

            },
            null,
            2
          )
        );


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

          if (
            typeof calculateFinalMutualCompatibilityScore ===
            "function"
          ) {

            finalMutual =
              calculateFinalMutualCompatibilityScore(
                mutualHardMatch,
                mutualExpectation,
                mutualProfile
              ) ||
              finalMutual;

          }

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
        // ACCEPT CANDIDATE
        // ======================================================

        diagnostic.accepted++;


        // ======================================================
        // PROFILE PHOTO — FINAL SAFE VALUE
        // ======================================================

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


        // ======================================================
        // CONVERT PHOTO URL
        // ======================================================

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

            candidatePhoto =
              candidatePhotoRaw;

          }

        }


        // ======================================================
        // HARD STATUS DIAGNOSTIC
        // ======================================================

        const diagnosticViewerHardStatus =
          String(
            viewerToCandidateHard &&
            viewerToCandidateHard.matchStatus
              ? viewerToCandidateHard.matchStatus
              : ""
          )
          .trim()
          .toUpperCase();


        const diagnosticCandidateHardStatus =
          String(
            candidateToViewerHard &&
            candidateToViewerHard.matchStatus
              ? candidateToViewerHard.matchStatus
              : ""
          )
          .trim()
          .toUpperCase();


        if (
          diagnosticViewerHardStatus ===
            "HARD_MATCH" &&

          diagnosticCandidateHardStatus ===
            "HARD_MATCH"
        ) {

          hardMatchCount++;

        }

        else if (
          diagnosticViewerHardStatus ===
            "NO_HARD_CRITERIA" ||

          diagnosticCandidateHardStatus ===
            "NO_HARD_CRITERIA"
        ) {

          noHardCriteriaCount++;

        }

        else if (
          diagnosticViewerHardStatus ===
            "HARD_REJECT" ||

          diagnosticCandidateHardStatus ===
            "HARD_REJECT"
        ) {

          hardRejectCount++;

        }

        else {

          unknownHardStatusCount++;

        }


        // ======================================================
        // KEEP FIRST 10 HARD STATUS EXAMPLES
        // ======================================================

        if (
          hardStatusExamples.length < 10
        ) {

          hardStatusExamples.push({

            id:
              compatibilityCandidate.id,

            name:
              compatibilityCandidate.name,

            viewerToCandidate:
              diagnosticViewerHardStatus,

            candidateToViewer:
              diagnosticCandidateHardStatus,

            mutualHardMatch:
              mutualHardMatch

          });

        }


        // ======================================================
        // FINAL RESULT
        // ======================================================

        results.push({

          // ====================================================
          // BASIC PROFILE
          // ====================================================

          id:
            profile.id || "",

          name:
            profile.name || "",

          type:
            profile.type || "",

          ownerMobile:
            profile.mobile1 ||
            profile.mobile2 ||
            "",
          // ====================================================
          // PHOTO
          // ====================================================

          photo:
            candidatePhoto,

          photoRaw:
            candidatePhotoRaw,

          found:
            true,


          // ====================================================
          // DISPLAY DATA
          // ====================================================

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


          // ====================================================
          // EXPECTATION
          // ====================================================

          hasExpectation:
            hasExpectation,

          hasMeaningfulExpectation:
            candidateHasMeaningfulExpectation,


          // ====================================================
          // MUTUAL HARD MATCH
          // ====================================================

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


          // ====================================================
          // MUTUAL EXPECTATION
          // ====================================================

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


          // ====================================================
          // MUTUAL PROFILE
          // ====================================================

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


          // ====================================================
          // FINAL MUTUAL SCORE
          // ====================================================

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


          // ====================================================
          // RANKING MODE
          // ====================================================

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

        // Continue remaining candidates.

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
  // HARD MATCH DIAGNOSTIC OUTPUT
  // ==========================================================

  console.log(
    "=================================================="
  );

  console.log(
    "HARD MATCH DIAGNOSTIC"
  );

  console.log(
    "HARD MATCH COUNT:",
    hardMatchCount
  );

  console.log(
    "NO HARD CRITERIA COUNT:",
    noHardCriteriaCount
  );

  console.log(
    "HARD REJECT COUNT:",
    hardRejectCount
  );

  console.log(
    "UNKNOWN HARD STATUS COUNT:",
    unknownHardStatusCount
  );

  console.log(
    "HARD STATUS EXAMPLES:",
    hardStatusExamples
  );

  console.log(
    "=================================================="
  );


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
      "ID048",
      "bride"
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


// testFinalMatchingPipeline


function testFinalMatchingPipeline() {

  // ==========================================================
  // TEST USER
  // ==========================================================

  const viewerId =
    "ID048";

  const viewerType =
    "bride";


  console.log(
    "=================================================="
  );

  console.log(
    "FINAL MATCHING PIPELINE TEST"
  );

  console.log(
    "Viewer:",
    viewerId,
    "| Type:",
    viewerType
  );

  console.log(
    "=================================================="
  );


  // ==========================================================
  // EXISTING RANKING ENGINE
  //
  // DO NOT CHANGE THE RANKING FUNCTION
  // ==========================================================

  const result =
    calculateActualProfileRanking(
      viewerId,
      viewerType
    );


  // ==========================================================
  // RESULT VALIDATION
  // ==========================================================

  if (
    !result ||
    result.success !== true
  ) {

    console.log(
      "❌ FINAL PIPELINE FAILED"
    );

    console.log(
      "Message:",
      result &&
      result.message
        ? result.message
        : "Unknown error"
    );

    return;

  }


  // ==========================================================
  // SUMMARY
  // ==========================================================

  const summary =
    result.summary || {};


  console.log(
    "PIPELINE SUMMARY:",
    {

      totalCandidates:
        summary.totalCandidates,

      mutualHardMatched:
        summary.mutualHardMatched,

      finalMutualCompatibilityCandidates:
        summary.finalMutualCompatibilityCandidates,

      meaningfulExpectationCandidates:
        summary.meaningfulExpectationCandidates,

      topMatches:
        summary.topMatches

    }
  );


  // ==========================================================
  // TOP 10
  // ==========================================================

  const topMatches =
    Array.isArray(
      result.top10
    )
      ? result.top10
      : [];


  console.log(
    "--------------------------------------------------"
  );

  console.log(
    "TOP MATCHES"
  );

  console.log(
    "--------------------------------------------------"
  );


  topMatches.forEach(
    function(candidate, index) {

      if (!candidate) {
        return;
      }


      const rank =
        Number(
          candidate.rank
        ) || index + 1;


      const hardScore =
        Number(
          candidate.hardScore
        ) || 0;


      const expectationPercentage =
        Number(
          candidate.expectationCompatibilityPercentage
        ) || 0;


      const expectationMaxScore =
        Number(
          candidate.expectationCompatibilityMaxScore
        ) || 0;


      const expectationScore =
        Number(
          candidate.expectationCompatibilityScore
        ) || 0;


      const profilePercentage =
        Number(
          candidate.profileCompatibilityPercentage
        ) || 0;


      const finalScore =
        Number(
          candidate.finalScore
        ) || 0;


      // ------------------------------------------------------
      // PROFILE CONTRIBUTION
      //
      // Profile component has maximum weight = 20.
      // ------------------------------------------------------

      const profileScore =
        (
          profilePercentage *
          20 /
          100
        );


      console.log(
        {

          rank:
            rank,

          id:
            candidate.id || "",

          name:
            candidate.name || "",

          hardMatch:
            candidate.hardMatch === true,

          hardScore:
            Number(
              hardScore.toFixed(2)
            ),

          expectationPercentage:
            Number(
              expectationPercentage.toFixed(2)
            ),

          expectationScore:
            Number(
              expectationScore.toFixed(2)
            ),

          expectationMaxScore:
            expectationMaxScore,

          profilePercentage:
            Number(
              profilePercentage.toFixed(2)
            ),

          profileScore:
            Number(
              profileScore.toFixed(2)
            ),

          finalScore:
            Number(
              finalScore.toFixed(2)
            )

        }
      );

    }
  );


  // ==========================================================
  // FINAL SCORE VALIDATION
  // ==========================================================

  console.log(
    "--------------------------------------------------"
  );

  console.log(
    "FINAL SCORE VALIDATION"
  );

  console.log(
    "--------------------------------------------------"
  );


  let scoreValidationPassed =
    true;


  topMatches.forEach(
    function(candidate, index) {

      if (!candidate) {
        return;
      }


      const finalScore =
        Number(
          candidate.finalScore
        );


      const valid =
        !isNaN(finalScore) &&
        finalScore >= 0 &&
        finalScore <= 100;


      if (!valid) {

        scoreValidationPassed =
          false;

      }


      console.log(
        "#" +
        (
          candidate.rank ||
          index + 1
        ),

        candidate.id || "",

        "→",

        isNaN(finalScore)
          ? "INVALID"
          : finalScore,

        "/ 100",

        valid
          ? "✅"
          : "❌"
      );

    }
  );


  // ==========================================================
  // RANKING ORDER VALIDATION
  // ==========================================================

  let rankingCorrect =
    true;


  for (
    let i = 1;
    i < topMatches.length;
    i++
  ) {

    const previousScore =
      Number(
        topMatches[i - 1].finalScore
      );


    const currentScore =
      Number(
        topMatches[i].finalScore
      );


    if (
      isNaN(previousScore) ||
      isNaN(currentScore) ||
      currentScore > previousScore
    ) {

      rankingCorrect =
        false;

      break;

    }

  }


  console.log(
    "Ranking Order:",
    rankingCorrect
      ? "✅ CORRECT"
      : "❌ INCORRECT"
  );


  // ==========================================================
  // FINAL TEST RESULT
  // ==========================================================

  const pipelinePassed =
    scoreValidationPassed &&
    rankingCorrect;


  console.log(
    "=================================================="
  );

  console.log(
    "FINAL PIPELINE TEST:",
    pipelinePassed
      ? "✅ PASSED"
      : "⚠️ CHECK REQUIRED"
  );

  console.log(
    "=================================================="

  );

}